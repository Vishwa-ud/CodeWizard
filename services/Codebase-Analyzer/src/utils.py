import ast
import astor

def generate_flowchart_from_code(code, language):
    """
    Parses the provided code into an Abstract Syntax Tree (AST) and generates
    a flowchart structure from it. Currently, it supports Python. 

    Args:
        code (str): The source code to analyze.
        language (str): The programming language of the source code.

    Returns:
        dict: A dictionary containing the nodes and edges representing the flowchart.
    """
    # Initialize nodes and edges lists for the flowchart
    nodes = []
    edges = []
    node_id = 0
    parent_map = {}

    def add_node(label):
        """
        Adds a new node to the flowchart.

        Args:
            label (str): The label of the node.

        Returns:
            int: The ID of the newly created node.
        """
        nonlocal node_id
        node_id += 1
        node = {"id": str(node_id), "label": label}
        nodes.append(node)
        return node_id

    def traverse(node, parent_id=None):
        """
        Traverses the AST recursively to generate nodes and edges for the flowchart.

        Args:
            node (ast.AST): The current AST node being visited.
            parent_id (int, optional): The ID of the parent node in the flowchart.
        """
        if isinstance(node, ast.FunctionDef):
            current_id = add_node(f"Function: {node.name}")
            if parent_id:
                edges.append({"source": str(parent_id), "target": str(current_id)})
            parent_map[node] = current_id
        elif isinstance(node, ast.If):
            current_id = add_node(f"If condition at line {node.lineno}")
            if parent_id:
                edges.append({"source": str(parent_id), "target": str(current_id)})
            parent_map[node] = current_id
        elif isinstance(node, ast.For):
            current_id = add_node(f"For loop at line {node.lineno}")
            if parent_id:
                edges.append({"source": str(parent_id), "target": str(current_id)})
            parent_map[node] = current_id
        elif isinstance(node, ast.While):
            current_id = add_node(f"While loop at line {node.lineno}")
            if parent_id:
                edges.append({"source": str(parent_id), "target": str(current_id)})
            parent_map[node] = current_id
        elif isinstance(node, ast.Return):
            current_id = add_node(f"Return statement at line {node.lineno}")
            if parent_id:
                edges.append({"source": str(parent_id), "target": str(current_id)})
            parent_map[node] = current_id
        elif isinstance(node, ast.Assign):
            current_id = add_node(f"Assignment at line {node.lineno}")
            if parent_id:
                edges.append({"source": str(parent_id), "target": str(current_id)})
            parent_map[node] = current_id
        else:
            # Handle other node types as necessary
            return
        
        # Recursively traverse child nodes
        for child in ast.iter_child_nodes(node):
            traverse(child, parent_map.get(node))

    if language == 'python':
        # Parse the Python code into an AST
        tree = ast.parse(code)
    else:
        # Placeholder for handling other languages
        raise ValueError(f"Language '{language}' is not supported yet.")

    # Start the AST traversal from the root
    traverse(tree)

    # Use astor for more advanced AST manipulations if needed
    pretty_code = astor.to_source(tree)

    # Return the generated flowchart data
    return {"nodes": nodes, "edges": edges, "pretty_code": pretty_code}
