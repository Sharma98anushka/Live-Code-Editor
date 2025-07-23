const htmlEditor = document.getElementById('html');
const cssEditor = document.getElementById('css');
const jsEditor = document.getElementById('js');
const outputFrame = document.getElementById('output');
const updateButton = document.getElementById('updatePreview');
const downloadButton = document.getElementById('downloadOutput');
const editorContainer = document.querySelector('.editor-container');
const outputContainer = document.querySelector('.output-container');

// Function to update the output iframe
function updateOutput() {
    const html = htmlEditor.value;
    const css = cssEditor.value;
    const js = jsEditor.value;

    const outputDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;

    // Resetting the iframe content
    outputDoc.open();
    outputDoc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
</head>
<body>
</body>
</html>
    `);

    // Add HTML
    outputDoc.body.innerHTML = html;

    // Add CSS
    if (css) {
        const styleTag = outputDoc.createElement('style');
        styleTag.textContent = css;
        outputDoc.head.appendChild(styleTag);
    }

    // Add JavaScript
    if (js) {
        const scriptTag = outputDoc.createElement('script');
        scriptTag.textContent = js;
        outputDoc.body.appendChild(scriptTag);
    }

    outputDoc.close();
}

// Function to download the output as an HTML file
function downloadOutput() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <style>${cssEditor.value}</style>
</head>
<body>
    ${htmlEditor.value}
    <script>${jsEditor.value}<\/script>
</body>
</html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'output.html';
    link.click();
}

// Enable drag-and-drop file loading
function enableDragAndDrop() {
    const editors = [htmlEditor, cssEditor, jsEditor];

    editors.forEach(editor => {
        editor.addEventListener('dragover', e => e.preventDefault());
        editor.addEventListener('drop', e => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    editor.value = reader.result;
                   // updateOutput();
                };
                reader.readAsText(file);
            }
        });
    });
}

// Add event listeners
updateButton.addEventListener('click', updateOutput);
downloadButton.addEventListener('click', downloadOutput);

// Initialize preview and drag-and-drop
updateOutput();
enableDragAndDrop();
