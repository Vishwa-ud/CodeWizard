

import React from 'react';
import CodeInput from './CodeInput';
import RightPanel from './RightPanel.jsx';
import ResultWindow from './ResultWindow';

function CodeAnalysisPage() {
  return (
    <div className="container-fluid">
        <div className="row">
            {/* input Area */}
            <div className="col-md-8 p-3">
            <CodeInput />
            </div>

            {/* Side Panel for Options */}
            <div className="col-md-4 p-3">
            <RightPanel />
            </div>

        </div>

        {/* result Window */}
        <div className="row mt-3">
            <div className="col-12 p-3">
                <ResultWindow />
            </div>
        </div>

    </div>
  );
}

export default CodeAnalysisPage;
