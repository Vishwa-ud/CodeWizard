
import React from 'react';

function CodeInput() {
    return (
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">Code Input Area</div>
                
                {/* area yto input code */}
                <div className="card-body">
                    <textarea 
                    className="form-control" 
                    rows="15" 
                    placeholder="Paste your code here..."
                    ></textarea>
                </div>
        </div>
    );
}

export default CodeInput;
