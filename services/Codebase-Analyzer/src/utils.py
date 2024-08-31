import ast
import astor

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
                    current_id = add_node(f"Function call: {func_name} at line {node.lineno}", parent_map[node], depth_map[parent_map[node]] + 1)
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
