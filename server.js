const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());

let activeFlow = { nodes: [], edges: [] };

app.post('/deploy', (req, res) => {
    activeFlow = req.body;
    console.log('Flow deployed:', activeFlow.nodes.length, 'nodes');
    res.sendStatus(200);
});

app.post('/trigger/:id', async (req, res) => {
    const startNode = activeFlow.nodes.find(n => n.id === req.params.id);
    if (!startNode) return res.status(404).send('Node not found');

    console.log('Triggering flow from:', startNode.label);
    executeNode(startNode, {});
    res.sendStatus(200);
});

async function executeNode(node, msg) {
    console.log('Executing:', node.label, node.type);

    try {
        if (node.type === 'whatsapp') {
            await sendWhatsApp(node.config, msg);
        } else if (node.type === 'http') {
            // Simple HTTP Request implementation
            if (node.config && node.config.url) {
                await fetch(node.config.url);
            }
        }
        // Add more node types here
    } catch (err) {
        console.error('Error executing node:', node.id, err.message);
    }

    // Find next nodes
    const wires = activeFlow.edges.filter(e => e.source === node.id);
    wires.forEach(wire => {
        const nextNode = activeFlow.nodes.find(n => n.id === wire.target);
        if (nextNode) executeNode(nextNode, msg);
    });
}

async function sendWhatsApp(config, msg) {
    const target = config.target || '628999587888'; // Default to user's number
    const message = config.message || 'Halo dari NodeBlu!';
    const token = config.token; // User needs to provide Fonnte token or similar

    console.log(`[WhatsApp] Sending to ${target}: ${message}`);

    if (!token) {
        console.log('[WhatsApp] No token provided. Simulation mode.');
        return;
    }

    // Example using Fonnte API (common in Indonesia)
    try {
        const formData = new FormData();
        formData.append('target', target);
        formData.append('message', message);

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: formData
        });
        const result = await response.json();
        console.log('[WhatsApp] API Response:', result);
    } catch (error) {
        console.error('[WhatsApp] Failed to send:', error);
    }
}

app.listen(3000, () => console.log('Server jalan di http://localhost:3000'));