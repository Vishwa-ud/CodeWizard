from code_analyzer import CodeAnalyzer  # type: ignore
import os
import ast
import re

# for code analysis
def analyze_code(code):
    """
    Analyze the provided code and return the exported analysis reports.
    deletes the generated HTML report after reading.
    
    Args:
    - code (str): The source code to analyze.
    
    Returns:
    - dict: Contains the exported HTML report or a specific portion of it.
    """
    try:
        # Initialize the CodeAnalyzer
        code_analyzer = CodeAnalyzer()
        code_analyzer.start()
        
        # Record the code for analysis
        code_analyzer.record_comment_for_interpretable_next(code)
        
        # Define a dummy function to simulate code execution and analysis
        def dummy_function(depth: int) -> int:
            code_analyzer.record_comment_for_interpretable_previous({"__depth": depth})
            if depth <= 0:
                code_analyzer.record_comment_for_interpretable_next({"Final depth": depth})
                return depth
            return dummy_function(depth - 1)

        # Execute the dummy function to analyze the provided code
        dummy_function(5)
        
        # Stop the analyzer
        code_analyzer.stop()
        
        # Export the analysis report to HTML
        code_analyzer.get_code_analyzer_printer().export_rich_to_html()
        
        # Read the generated HTML report
        report_filename = "__main___code_analysis_rich.html"
        if os.path.exists(report_filename):
            with open(report_filename, "r", encoding="utf-8") as html_file:
                html_report = html_file.read()

            # Delete the report file after reading
            os.remove(report_filename)

            # Find the specific HTML section
            marker = (
                '<span class="r1">Line of code Analysis</span>'
            )
            start_index = html_report.find(marker)

            if start_index != -1:
                html_report = html_report[start_index:]
            else:
                html_report = "Specified HTML section not found."

            # Check if the HTML report is empty
            if not html_report.strip():
                html_report = "HTML report generation failed or returned empty."
        else:
            html_report = "Report file not found."

        # Return the HTML report or the specific portion
        return {
            "analysis_report_html": html_report
        }
    
    except Exception as e:
        print(f"Error analyzing code: {str(e)}")
        return {"error": "An error occurred during code analysis"}


# for function seperation for given python code detects functions and send them as a list in response
def extract_function_code(code, func_node):
    """
    Extract the source code for a given function node from the original code.
    Args:
    - code (str): The full source code.
    - func_node (ast.FunctionDef): The AST node corresponding to the function.
    Returns:
    - str: The extracted source code for the function.
    """
    start_line = func_node.lineno - 1
    end_line = func_node.end_lineno
    func_code_lines = code.splitlines()[start_line:end_line]
    return "\n".join(func_code_lines)

def detect_functions_from_code(code):
    """
    Detect and extract functions and imports in the provided code, filtering invalid content.
    
    Args:
    - code (str): The source code to analyze.
    
    Returns:
    - dict: Contains function names as keys and the function code, along with errors found.
    """
    functions = {}
    imports = []
    errors = []

    try:
        tree = ast.parse(code)

        # Track class methods to avoid duplicates
        class_methods = set()

        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                # Skip if the function is already listed as a class method
                if node.name in class_methods:
                    continue
                func_code = extract_function_code(code, node)
                functions[node.name] = func_code
            elif isinstance(node, ast.Import) or isinstance(node, ast.ImportFrom):
                import_stmt = extract_import_code(code, node)
                imports.append(import_stmt)
            elif isinstance(node, ast.ClassDef):
                methods = detect_class_methods(code, node)
                functions.update(methods)
                class_methods.update([method.split(".")[1] for method in methods])

    except SyntaxError as se:
        errors.append(f"SyntaxError: {str(se)} at line {se.lineno}")
        return filter_and_retry(code, se.lineno, functions, imports, errors)

    except IndentationError as ie:
        errors.append(f"IndentationError: {str(ie)} at line {ie.lineno}")
        return filter_and_retry(code, ie.lineno, functions, imports, errors)

    except Exception as e:
        errors.append(f"Unknown error: {str(e)}")
        return {"functions": functions, "imports": imports, "errors": errors}

    return {"functions": functions, "imports": imports, "errors": errors}

def extract_import_code(code, node):
    """
    Extract the source code for import statements.
    """
    start_line = node.lineno - 1
    return code.splitlines()[start_line]

def detect_class_methods(code, class_node):
    """
    Detect methods inside a class definition.
    """
    methods = {}
    for node in class_node.body:
        if isinstance(node, ast.FunctionDef):
            method_name = f"{class_node.name}.{node.name}"
            method_code = extract_function_code(code, node)
            methods[method_name] = method_code
    return methods

def filter_and_retry(code, error_line, functions, imports, errors):
    """
    Filter invalid content based on error line and retry parsing.
    """
    lines = code.splitlines()
    if error_line and 0 <= error_line - 1 < len(lines):
        errors.append(f"Filtered out problematic content at line {error_line}: {lines[error_line - 1]}")
        lines[error_line - 1] = ''
    
    filtered_code = "\n".join(lines)
    try:
        new_result = detect_functions_from_code(filtered_code)
        new_result["functions"].update(functions)
        new_result["imports"].extend(imports)
        new_result["errors"].extend(errors)
        return new_result
    
    except Exception as e:
        errors.append(f"Error after filtering: {str(e)}")
        return {"functions": functions, "imports": imports, "errors": errors}

# Test the changes using the code sample
code_sample ="""
import os
from math import pi

def func1():
    return "func1"

class Example:
    def method1(self):
        return "method1"
    
    @classmethod
    def class_method(cls):
        return "class method"
    
    @staticmethod
    def static_method():
        return "static method"

def outer_func(x):
    def inner_func(y):
        return x + y
    return inner_func
"""

result = detect_functions_from_code(code_sample)

print("Imports:")
for imp in result["imports"]:
    print(imp)

print("\nFunctions:")
for name, func in result["functions"].items():
    print(f"Function: {name}\nCode:\n{func}\n")

if result["errors"]:
    print("Errors:")
    for error in result["errors"]:
        print(error)