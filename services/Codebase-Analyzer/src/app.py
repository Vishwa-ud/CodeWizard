from flask import Flask, jsonify, request
from utils import generate_flowchart_from_code, flowchart_from_code
from analyzer import analyze_code  # Correct import for analyze_code
from flask_cors import CORS

# Initialize the Flask application
app = Flask(__name__)
CORS(app)

# Disable strict slashes for URL routing
app.url_map.strict_slashes = False

@app.route('/test-ag', methods=['GET'])
def hello_world():
    """
    Simple health check endpoint to ensure the server is running.
    """
    return 'Hello from Service 1!'

@app.route('/generate-flowchart-ag', methods=['POST'])
def generate_flowchart():
    """
    Endpoint to generate a flowchart from provided code.
    
    Expects JSON input with the following structure:
    {
        "code": "<source_code>",
        "language": "<programming_language>"
    }
    
    Returns:
    {
        "nodes": [<node1>, <node2>, ...],
        "edges": [<edge1>, <edge2>, ...]
    }
    """
    try:
        code = request.json.get('code', '')
        language = request.json.get('language', '').lower()
        params = request.json.get('params', {})

        if not code:
            return jsonify({"error": "No code provided"}), 400
        
        if not language:
            return jsonify({"error": "No programming language provided"}), 400
        
        valid_languages = ['python', 'java', 'javascript']
        if language not in valid_languages:
            return jsonify({"error": f"Unsupported language '{language}'. Supported languages: {', '.join(valid_languages)}."}), 400

        flowchart_data = flowchart_from_code(code,params)

        if not flowchart_data or 'nodes' not in flowchart_data or 'edges' not in flowchart_data:
            return jsonify({"error": "Failed to generate flowchart data."}), 500

        return jsonify(flowchart_data)

    except Exception as e:
        print(f"Error generating flowchart: {str(e)}")
        return jsonify({"error": "An error occurred while generating the flowchart"}), 500

@app.route('/generate-flowchart-ag2', methods=['POST'])
def generate_flowchart():
    """
    Endpoint to generate a flowchart from provided code.
    
    Expects JSON input with the following structure:
    {
        "code": "<source_code>",
        "language": "<programming_language>"
    }
    
    Returns:
    {
        "nodes": [<node1>, <node2>, ...],
        "edges": [<edge1>, <edge2>, ...]
    }
    """
    try:
        code = request.json.get('code', '')
        language = request.json.get('language', '').lower()

        if not code:
            return jsonify({"error": "No code provided"}), 400
        
        if not language:
            return jsonify({"error": "No programming language provided"}), 400
        
        valid_languages = ['python', 'java', 'javascript']
        if language not in valid_languages:
            return jsonify({"error": f"Unsupported language '{language}'. Supported languages: {', '.join(valid_languages)}."}), 400

        flowchart_data = generate_flowchart_from_code(code, language)

        if not flowchart_data or 'nodes' not in flowchart_data or 'edges' not in flowchart_data:
            return jsonify({"error": "Failed to generate flowchart data."}), 500

        return jsonify(flowchart_data)

    except Exception as e:
        print(f"Error generating flowchart: {str(e)}")
        return jsonify({"error": "An error occurred while generating the flowchart"}), 500

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

# Entry point to start the Flask application
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
