const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());

let activeFlow = { nodes: [], edges: [] };

app.post('/deploy', (req, res) => {
    try {
        activeFlow = req.body;
        if (!activeFlow || !activeFlow.nodes) {
            console.error('Invalid flow data received');
            return res.status(400).send('Invalid flow data');
        }
        console.log('Flow deployed:', activeFlow.nodes.length, 'nodes');
        res.sendStatus(200);
    } catch (e) {
        console.error('Error deploying flow:', e);
        res.status(500).send(e.message);
    }
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
    ```javascript
const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());

let activeFlow = { nodes: [], edges: [] };

app.post('/deploy', (req, res) => {
    try {
        activeFlow = req.body;
        if (!activeFlow || !activeFlow.nodes) {
            console.error('Invalid flow data received');
            return res.status(400).send('Invalid flow data');
        }
        console.log('Flow deployed:', activeFlow.nodes.length, 'nodes');
        res.sendStatus(200);
    } catch (e) {
        console.error('Error deploying flow:', e);
        res.status(500).send(e.message);
    }
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
    const target = config.target || '628999587888';
    const message = config.message || 'Halo dari NodeBlu!';
    const token = config.token;

    console.log('=== WhatsApp Send Request ===');
    console.log('Target:', target);
    console.log('Message:', message);
    console.log('Token:', token ? `${ token.substring(0, 10) }...` : 'NOT PROVIDED');

    if (!token) {
        console.log('[WhatsApp] ❌ No token provided. Simulation mode.');
        return;
    }

    // Fonnte API menggunakan application/x-www-form-urlencoded
    try {
        const formData = new URLSearchParams();
        formData.append('target', target);
        formData.append('message', message);
        formData.append('countryCode', '62'); // Indonesia

        console.log('[WhatsApp] 📤 Sending to Fonnte API...');
        
        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: formData
        });

        const result = await response.json();
        
        console.log('[WhatsApp] 📥 Response Status:', response.status);
        console.log('[WhatsApp] 📥 Response Body:', JSON.stringify(result, null, 2));
        
        if (result.status === true || response.ok) {
            console.log('[WhatsApp] ✅ Message sent successfully!');
        } else {
            console.log('[WhatsApp] ❌ Failed:', result.reason || result.message || 'Unknown error');
        }
        
        return result;
    } catch (error) {
        console.error('[WhatsApp] ❌ Error:', error.message);
        console.error('[WhatsApp] Stack:', error.stack);
        throw error;
    }
}

app.listen(3000, () => console.log('Server jalan di http://localhost:3000'));
```