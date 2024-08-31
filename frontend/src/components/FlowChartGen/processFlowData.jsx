// Example function to process incoming JSON data
export function processFlowData(data) {
    const nodes = data.nodes.map((node) => ({
      id: node.id,
      data: { label: node.label },
      position: node.position,
      style: node.style,
    }));
  
    const edges = data.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: edge.animated,
      label: edge.label,
    }));
  
    return { nodes, edges };
  }
  