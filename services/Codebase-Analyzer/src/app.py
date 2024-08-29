from flask import Flask, jsonify, request
from utils import generate_flowchart_from_code

# Basic: Initialize the Flask application
app = Flask(__name__)

# Necessary: Disable strict slashes for URL routing
app.url_map.strict_slashes = False

@app.route('/calculate', methods=['GET'])
def hello_world():
    """
    Simple health check endpoint to ensure the server is running.
    """
    return 'Hello from Service 1!'

@app.route('/generate-flowchart', methods=['POST'])
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
        # Extract the source code and language from the incoming request
        code = request.json.get('code', '')
        language = request.json.get('language', 'python').lower()

        # Validate the input
        if not code:
            return jsonify({"error": "No code provided"}), 400
        if not language:
            return jsonify({"error": "No language provided"}), 400

        # Generate the flowchart data using the utility function
        flowchart_data = generate_flowchart_from_code(code, language)

        # Return the generated flowchart data as JSON
        return jsonify(flowchart_data)

    except Exception as e:
        # Log the exception (can be expanded with a logging framework)
        print(f"Error generating flowchart: {str(e)}")

        # Return an error response
        return jsonify({"error": "An error occurred while generating the flowchart"}), 500

# Entry point to start the Flask application
if __name__ == '__main__':
    # Run the Flask app on all available IPs (0.0.0.0) and port 3001
    app.run(host='0.0.0.0', port=3001)
