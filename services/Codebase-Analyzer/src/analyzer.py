from code_analyzer import CodeAnalyzer
import io
import sys

def analyze_code(code):
    """
    Analyze the provided code and return the exported analysis reports.
    
    Args:
    - code (str): The source code to analyze.
    
    Returns:
    - dict: Contains the exported TXT and HTML reports.
    """
    try:
        # Initialize and start the CodeAnalyzer
        code_analyzer = CodeAnalyzer()
        code_analyzer.start()
        
        # Record the code for analysis
        code_analyzer.record_comment_for_interpretable_next(code)
        
        # Define and run a dummy function to trigger analysis
        def dummy_function(depth: int) -> int:
            code_analyzer.record_comment_for_interpretable_previous({"__depth": depth})
            if depth <= 0:
                code_analyzer.record_comment_for_interpretable_next({"Final depth": depth})
                return depth
            return dummy_function(depth - 1)

        # Execute the dummy function to analyze code
        dummy_function(5)
        
        # Stop the analyzer
        code_analyzer.stop()

        # Capture TXT report
        txt_output = io.StringIO()
        sys.stdout = txt_output
        code_analyzer.get_code_analyzer_printer().export_to_txt()
        sys.stdout = sys.__stdout__
        txt_report = txt_output.getvalue()

        # Capture HTML report
        html_output = io.StringIO()
        sys.stdout = html_output
        code_analyzer.get_code_analyzer_printer().export_rich_to_html()
        sys.stdout = sys.__stdout__
        html_report = html_output.getvalue()

        # Ensure reports are captured correctly
        if not txt_report.strip():
            txt_report = "TXT report generation failed or returned empty."
        if not html_report.strip():
            html_report = "HTML report generation failed or returned empty."

        # Return the reports as part of the result
        return {
            "analysis_report_txt": txt_report,
            "analysis_report_html": html_report
        }

    except Exception as e:
        print(f"Error analyzing code: {str(e)}")
        return {"error": "An error occurred during code analysis"}
