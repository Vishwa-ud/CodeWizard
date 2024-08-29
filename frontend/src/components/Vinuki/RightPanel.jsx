
import React from 'react';

function RightPanel() {
    return (
        <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">Options</div>
                
                <div className="card-body">
                    <button className="btn btn-success w-100 mb-2">Optimize Code</button>
                    <button className="btn btn-warning w-100 mb-2">Find Errors</button>
                    <button className="btn btn-info w-100">Refactor Code</button>
                </div>
        </div>
    );
}

export default RightPanel;
