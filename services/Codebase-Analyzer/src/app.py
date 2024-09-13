from flask import Flask, jsonify, request
from utils import generate_flowchart_from_code, flowchart_from_code, detect_functions_from_code, flowchart_from_snippet
from analyzer import analyze_code
from flask_cors import CORS

# TODO :REMOVE CORS 
# Initialize the Flask application
app = Flask(__name__)
CORS(app)

# Disable strict slashes for URL routing
app.url_map.strict_slashes = False

# Health Checking Endpoint
@app.route('/test-ag', methods=['GET'])
def hello_world():
    """
    Simple health check endpoint to ensure the server is running.
    """
    return 'Hello from Service 1!'

# Flowchart Generation Endpoint
# @app.route('/generate-flowchart-ag', methods=['POST'])
# def generate_flowchart():
#     """
#     Endpoint to generate a flowchart from provided code.
    
#     Expects JSON input with the following structure:
#     {
#         "code": "<source_code>",
#         "language": "<programming_language>"
#     }
    
#     Returns:
#     {
#         flowchartdata: <data for generating flowchart image>
#     """
#     try:
#         code = request.json.get('code', '')
#         language = request.json.get('language', '').lower()
#         params = request.json.get('params', {})

#         if not code:
#             return jsonify({"error": "No code provided"}), 400
        
#         if not language:
#             return jsonify({"error": "No programming language provided"}), 400
        
#         valid_languages = ['python', 'java', 'javascript']
#         if language not in valid_languages:
#             return jsonify({"error": f"Unsupported language '{language}'. Supported languages: {', '.join(valid_languages)}."}), 400

#         flowchart_data = flowchart_from_code(code,params)

#         if not flowchart_data:
#             return jsonify({"error": "No data To Show."}), 500

#         return jsonify(flowchart_data)

    # except Exception as e:
    #     print(f"Error generating flowchart: {str(e)}")
    #     return jsonify({"error": "An error occurred while generating the flowchart"}), 500

# enchanced Flowchart Generation Endpoint
@app.route('/generate-flowchart-ag', methods=['POST'])
def generate_flowchart_ag2():
    """
    Endpoint to generate a flowchart from provided code.
    
    Expects JSON input with the following structure:
    {
        "code": "<source_code>",
        "language": "<programming_language>",
        "function": "<function_name>" (optional)
    }
    
    Returns:
    {
        flowchartdata: <data for generating flowchart image>
    }
    """
    try:
        code = request.json.get('code', '')
        language = request.json.get('language', '').lower()
        function = request.json.get('function', '')

        # Validate code input
        if not code:
            return jsonify({"error": "No code provided"}), 400
        
        # Validate language input
        if not language:
            return jsonify({"error": "No programming language provided"}), 400
        
        valid_languages = ['python']  # Only support Python for now
        if language not in valid_languages:
            return jsonify({"error": f"Unsupported language '{language}'. Supported languages: {', '.join(valid_languages)}."}), 400

        # Generate flowchart data
        flowchart_data = flowchart_from_snippet(code, function)

        # Handle case when no flowchart data is returned
        if not flowchart_data:
            if function and function not in code:
                return jsonify({"error": f"Function '{function}' not found in provided code."}), 400
            return jsonify({"error": "No data to parse. Please check the provided code and fields."}), 400

        # Return the flowchart data if successful
        return jsonify(flowchart_data)

    except Exception as e:
        print(f"Error generating flowchart: {str(e)}")
        return jsonify({"error": "An error occurred while generating the flowchart"}), 500

    

# Code Analysis Endpoint
@app.route('/analyze-code', methods=['POST'])
def analyze_code_endpoint():
    """
    Endpoint to analyze the provided code.
    
    Expects JSON input with the following structure:
    {
        "code": "<source_code>"
    }
    
    Returns:
    {
        "num_functions": <number_of_functions>,
        "num_lines": <number_of_lines> 
    }
    """
    try:
        code = request.json.get('code', '')

        if not code:
            return jsonify({"error": "No code provided"}), 400

        analysis_result = analyze_code(code)

        if "error" in analysis_result:
            return jsonify(analysis_result), 500

        return jsonify(analysis_result)

    except Exception as e:
        print(f"Error analyzing code: {str(e)}")
        return jsonify({"error": "An error occurred while analyzing the code"}), 500

# function detection endpoint
@app.route('/detect-functions', methods=['POST'])
def detect_functions():
    """
    Endpoint to detect functions in the provided code.
    
    Expects JSON input with the following structure:
    {
        "code": "<source_code>"
    }
    
    Returns:
    {
        "functions": [<function1>, <function2>, ...],
        "imports": [<import1>, <import2>, ...],
        "errors": [<error1>, <error2>, ...]
    }
    """
    try:
        # Retrieve code from the JSON request
        code = request.json.get('code', '')

        if not code:
            return jsonify({"error": "No code provided"}), 400

        # Detect functions, imports, and errors
        result = detect_functions_from_code(code)

        # Send back the results
        return jsonify(result), 200

    except KeyError as e:
        # Handle KeyError if 'code' is missing in the request JSON
        return jsonify({"error": f"Missing key: {str(e)}"}), 400

    except SyntaxError as se:
        # Handle syntax errors in the code here
        return jsonify({"error": f"SyntaxError: {str(se)}"}), 400

    except Exception as e:
        # Common error handling here
        print(f"Error detecting functions: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    
# Entry point to start the Flask application
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
