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
    nodes = []
    edges = []
    node_id = 0
    parent_map = {}
    loop_stack = []  # To handle nested loops

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
        current_id = None

        if isinstance(node, ast.FunctionDef):
            current_id = add_node(f"Function: {node.name}")
            parent_map[node] = current_id
        elif isinstance(node, ast.If):
            current_id = add_node(f"If condition at line {node.lineno}")
            parent_map[node] = current_id
        elif isinstance(node, ast.For):
            current_id = add_node(f"For loop at line {node.lineno}")
            loop_stack.append(current_id)  # Add loop to stack for proper linking
            parent_map[node] = current_id
        elif isinstance(node, ast.While):
            current_id = add_node(f"While loop at line {node.lineno}")
            loop_stack.append(current_id)
            parent_map[node] = current_id
        elif isinstance(node, ast.Return):
            current_id = add_node(f"Return statement at line {node.lineno}")
        elif isinstance(node, ast.Assign):
            current_id = add_node(f"Assignment at line {node.lineno}")

        if current_id is not None and parent_id is not None:
            edges.append({"source": str(parent_id), "target": str(current_id)})

        for child in ast.iter_child_nodes(node):
            traverse(child, current_id)

        if isinstance(node, (ast.For, ast.While)):
            loop_stack.pop()  # Remove loop from stack after processing

    def handle_function_calls(tree):
        """
        Traverses the AST to connect function calls to their respective definitions.
        """
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                func_name = get_func_name(node)
                if func_name and func_name in parent_map:
                    current_id = add_node(f"Function call: {func_name} at line {node.lineno}")
                    edges.append({"source": str(parent_map[node]), "target": str(current_id)})
                    parent_map[node] = current_id

    def get_func_name(node):
        """
        Retrieves the function name from a function call node.

        Args:
            node (ast.Call): The function call node.

        Returns:
            str: The function name.
        """
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
    handle_function_calls(tree)  # Handle function calls after main traversal

    pretty_code = astor.to_source(tree)

    return {"nodes": nodes, "edges": edges, "pretty_code": pretty_code}

# ;] Extendable to other languages by implementing additional parsing and traversing logic
