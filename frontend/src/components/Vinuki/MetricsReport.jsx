

import React from 'react';
import { Bar, Line, Scatter } from 'react-chartjs-2';

function MetricsReport({ metrics }) {

    // Data preparation for visualizations
    const complexityData = {
        labels: metrics.functions.map((func) => func.name),
        datasets: [
        {
            label: 'Cyclomatic Complexity',
            data: metrics.functions.map((func) => func.complexity),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        ],
    };

    const linesOfCodeData = {
        labels: metrics.functions.map((func) => func.name),
        datasets: [
        {
            label: 'Lines of Code',
            data: metrics.functions.map((func) => func.linesOfCode),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        ],
    };

    const functionLengthData = {
        labels: metrics.functions.map((func) => func.name),
        datasets: [
        {
            label: 'Function Length',
            data: metrics.functions.map((func) => func.length),
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
        },
        ],
    };

    const commentDensityData = {
        labels: metrics.functions.map((func) => func.name),
        datasets: [
        {
            label: 'Comment Density',
            data: metrics.functions.map((func) => func.commentDensity),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
        ],
    };

    const nestingDepthData = {
        labels: metrics.functions.map((func) => func.name),
        datasets: [
        {
            label: 'Nesting Depth',
            data: metrics.functions.map((func) => func.nestingDepth),
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
        },
        ],
    };


    return (
        <div>
            <h3>Code Metrics Report</h3>

            <div className="chart-container">
                {/* cyclomatic Complexity */}
                <Bar data={complexityData} options={{ responsive: true }} />

                {/* lines of code */}
                <Scatter data={linesOfCodeData} options={{ responsive: true }} />

                {/* function Length */}
                <Bar data={functionLengthData} options={{ responsive: true }} />

                {/* comment Density */}
                <Line data={commentDensityData} options={{ responsive: true }} />

                {/* nesting Depth */}
                <Bar data={nestingDepthData} options={{ responsive: true }} />
            </div>
        </div>
    );
}

export default MetricsReport;
