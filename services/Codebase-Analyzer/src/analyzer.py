from code_analyzer import CodeAnalyzer  # type: ignore
import os

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
