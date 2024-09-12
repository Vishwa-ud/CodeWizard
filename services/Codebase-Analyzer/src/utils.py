import ast
import astor
from pyflowchart import Flowchart

# major seperation: code Imagination things
def generate_flowchart_from_code(code, language):
    nodes = []
    edges = []
    node_id = 1
    parent_map = {}
    position_map = {}  # Map to track positions used by nodes

    # Fixed start node
    start_node = {
        "id": str(node_id),
        "label": 'Start',
        "position": {"x": 0, "y": 0}
    }
    nodes.append(start_node)
    
    # Initialize positions
    current_position = {"x": 0, "y": 70}
    position_offset = {"x": 300, "y": 150}  # Space between nodes
    horizontal_offset = 300

    def get_next_position(depth, y_offset=0):
        """
        Calculate the next available position at the given depth level.
        """
        x = depth * horizontal_offset
        y = current_position["y"] + y_offset

        # Check for overlap and adjust
        while (x, y) in position_map.values():
            y += position_offset["y"]

        return {"x": x, "y": y}

    def add_node(label, parent_id=None, depth=0, y_offset=0):
        nonlocal node_id, current_position

        # Calculate position based on depth
        position = get_next_position(depth, y_offset)
        current_position["y"] = max(current_position["y"], position["y"] + position_offset["y"])

        node_id += 1
        node = {
            "id": str(node_id),
            "label": label,
            "position": position
        }
        nodes.append(node)
        
        # Track the position
        position_map[node_id] = (position["x"], position["y"])

        if parent_id is not None:
            edges.append({"id": f"e{parent_id}-{node_id}", "source": str(parent_id), "target": str(node_id)})

        return node_id
    

    def traverse(node, parent_id=None, depth=0):
        current_id = None
        branch_nodes = []

        if isinstance(node, ast.FunctionDef):
            current_id = add_node(f"Function: {node.name}", parent_id, depth)
            parent_map[node] = current_id
        elif isinstance(node, ast.If):
            current_id = add_node(f"If condition at line {node.lineno}", parent_id, depth)
            parent_map[node] = current_id
            branch_nodes = handle_if_else(node, current_id, depth)
        elif isinstance(node, ast.For):
            current_id = add_node(f"For loop at line {node.lineno}", parent_id, depth)
            parent_map[node] = current_id
        elif isinstance(node, ast.While):
            current_id = add_node(f"While loop at line {node.lineno}", parent_id, depth)
            parent_map[node] = current_id
        elif isinstance(node, ast.Return):
            current_id = add_node(f"Return statement at line {node.lineno}", parent_id, depth)
        elif isinstance(node, ast.Assign):
            current_id = add_node(f"Assignment at line {node.lineno}", parent_id, depth)
        elif isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
            func_name = get_func_name(node.value)
            if func_name:
                current_id = add_node(f"Function call: {func_name} at line {node.lineno}", parent_id, depth)

        if current_id is not None:
            parent_map[node] = current_id

        for child in ast.iter_child_nodes(node):
            if branch_nodes:
                traverse(child, branch_nodes.pop(0), depth + 1)
            else:
                traverse(child, current_id, depth)

    def handle_if_else(if_node, parent_id, depth):
        """
        Handles the `if` and `else` branches, ensuring each branch is represented in the flowchart.
        """
        branch_nodes = []
        if_node_id = parent_map[if_node]

        # Process 'if' body
        for i, node in enumerate(if_node.body):
            branch_id = add_node(f"If true at line {node.lineno}", if_node_id, depth + 1, i * position_offset["y"])
            branch_nodes.append(branch_id)

        # Process 'else' body
        if if_node.orelse:
            for i, node in enumerate(if_node.orelse):
                branch_id = add_node(f"If false at line {node.lineno}", if_node_id, depth + 1, (len(if_node.body) + i) * position_offset["y"])
                branch_nodes.append(branch_id)

        return branch_nodes

    def handle_function_calls(tree):
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                func_name = get_func_name(node)
                if func_name and func_name in parent_map:
                    current_id = add_node(f"Function call: {func_name} at line {node.lineno}", parent_map[node], depth_map[parent_map[node]] + 1) # type: ignore
                    parent_map[node] = current_id

    def get_func_name(node):
        if isinstance(node.func, ast.Name):
            return node.func.id
        elif isinstance(node.func, ast.Attribute):
            return node.func.attr
        return None

    if language == 'python':
        tree = ast.parse(code)
    else:
        raise ValueError(f"Language '{language}' is not supported yet.")

    traverse(tree)
    handle_function_calls(tree)

    # Add the end node with fixed position
    end_node_id = node_id + 1
    end_node = {
        "id": str(end_node_id),
        "label": 'End',
        "position": {"x": 0, "y": current_position["y"] + position_offset["y"]}
    }
    nodes.append(end_node)

    # Ensure start node connects to the first node
    if len(nodes) > 1:
        edges.append({"id": "e1-2", "source": "1", "target": nodes[1]["id"], "label": "start"})

    # Connect all non-connected nodes to the end node
    connected_nodes = {edge["source"] for edge in edges}
    for node in nodes:
        if node["id"] not in connected_nodes and node["id"] != str(end_node_id):
            edges.append({"id": f"e{node['id']}-{end_node_id}", "source": node["id"], "target": str(end_node_id), "label": "end"})

    pretty_code = astor.to_source(tree)

    return {
        "nodes": nodes,
        "edges": edges,
        "pretty_code": pretty_code
    }


def flowchart_from_code(code,params):
    fc = Flowchart.from_code(code, field='example', inner=False)
    return {
        "flowchart": fc.flowchart(),
    }

# major seperation: code validation and seperation things
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
# code_sample ="""
# import os
# from math import pi

# def func1():
#     return "func1"

# class Example:
#     def method1(self):
#         return "method1"
    
#     @classmethod
#     def class_method(cls):
#         return "class method"
    
#     @staticmethod
#     def static_method():
#         return "static method"

# def outer_func(x):
#     def inner_func(y):
#         return x + y
#     return inner_func
# """

# result = detect_functions_from_code(code_sample)

# print("Imports:")
# for imp in result["imports"]:
#     print(imp)

# print("\nFunctions:")
# for name, func in result["functions"].items():
#     print(f"Function: {name}\nCode:\n{func}\n")

# if result["errors"]:
#     print("Errors:")
#     for error in result["errors"]:
#         print(error)