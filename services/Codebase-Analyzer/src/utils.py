import ast
import astor

def generate_flowchart_from_code(code, language):
    nodes = []
    edges = []
    node_id = 0
    parent_map = {}
    
    # Initialize positions
    current_position = {"x": 0, "y": 0}
    position_offset = {"x": 300, "y": 150}  # Space between nodes

    def add_node(label, style=None):
        nonlocal node_id, current_position

        # Positioning logic to avoid overlap and structure the flowchart
        position = {"x": current_position["x"], "y": current_position["y"]}
        current_position["y"] += position_offset["y"]  # Move downwards for next node
        
        node_id += 1
        node = {
            "id": str(node_id),
            "data": {"label": label},
            "position": position,
            "style": style if style else {
                "padding": "10px",
                "borderRadius": "5px",
                "backgroundColor": "#e8e8e8",
                "border": "1px solid #333",
                "whiteSpace": "pre-wrap"
            }
        }
        nodes.append(node)
        return node_id

    def traverse(node, parent_id=None):
        current_id = None

        if isinstance(node, ast.FunctionDef):
            current_id = add_node(f"Function: {node.name}")
            parent_map[node] = current_id
        elif isinstance(node, ast.If):
            current_id = add_node(f"If condition at line {node.lineno}")
            parent_map[node] = current_id
        elif isinstance(node, ast.For):
            current_id = add_node(f"For loop at line {node.lineno}")
            parent_map[node] = current_id
        elif isinstance(node, ast.While):
            current_id = add_node(f"While loop at line {node.lineno}")
            parent_map[node] = current_id
        elif isinstance(node, ast.Return):
            current_id = add_node(f"Return statement at line {node.lineno}")
        elif isinstance(node, ast.Assign):
            current_id = add_node(f"Assignment at line {node.lineno}")
        elif isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
            func_name = get_func_name(node.value)
            if func_name:
                current_id = add_node(f"Function call: {func_name} at line {node.lineno}")

        if current_id is not None and parent_id is not None:
            edges.append({"source": str(parent_id), "target": str(current_id)})

        for child in ast.iter_child_nodes(node):
            traverse(child, current_id)

    def handle_function_calls(tree):
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                func_name = get_func_name(node)
                if func_name and func_name in parent_map:
                    current_id = add_node(f"Function call: {func_name} at line {node.lineno}")
                    edges.append({"source": str(parent_map[node]), "target": str(current_id)})
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

    pretty_code = astor.to_source(tree)

    return {
        "nodes": nodes,
        "edges": edges,
        "pretty_code": pretty_code
    }

# Example usage
code = """
def greet(name):
    if name:
        return f'Hello, {name}!'
    else:
        return 'Hello, world!'

for i in range(3):
    print(greet('Alice'))
"""
language = 'python'
flowchart_data = generate_flowchart_from_code(code, language)
print(flowchart_data)
