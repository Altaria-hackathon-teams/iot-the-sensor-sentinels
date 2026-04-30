/**
 * AI Service for generating agricultural insights based on sensor data
 */

const generateInsights = (sensorData) => {
    const { soil, temp, pH, distance, phosphorus, nitrogen, humidity } = sensorData;
    const insights = [];

    // Soil Moisture Logic
    if (soil < 30) {
        insights.push({
            type: 'CRITICAL',
            title: 'Critical Soil Moisture',
            message: 'Soil moisture is dangerously low. Activate irrigation system immediately to prevent crop wilting.',
            action: 'Turn on Water Pump'
        });
    } else if (soil < 50) {
        insights.push({
            type: 'WARNING',
            title: 'Low Moisture Alert',
            message: 'Moisture levels are dropping. Consider watering within the next 4-6 hours.',
            action: 'Schedule Irrigation'
        });
    } else {
        insights.push({
            type: 'SUCCESS',
            title: 'Optimal Soil Moisture',
            message: 'Soil moisture is at a healthy level. No irrigation needed at this time.',
            action: 'Continue Monitoring'
        });
    }

    // pH Level Logic
    if (pH < 6.0) {
        insights.push({
            type: 'WARNING',
            title: 'Acidic Soil detected',
            message: `pH level is ${pH}. Consider adding lime to neutralize soil acidity for better nutrient absorption.`,
            action: 'Add Soil Lime'
        });
    } else if (pH > 7.5) {
        insights.push({
            type: 'WARNING',
            title: 'Alkaline Soil detected',
            message: `pH level is ${pH}. Consider adding sulfur or organic mulch to lower pH.`,
            action: 'Add Soil Acidifier'
        });
    }

    // Nutrient Analysis (Phosphorus / Nitrogen)
    if (nitrogen < 40) {
        insights.push({
            type: 'INFO',
            title: 'Low Nitrogen Levels',
            message: 'Nitrogen levels are slightly below target. Apply organic fertilizer for better leaf growth.',
            action: 'Apply N-Fertilizer'
        });
    }

    if (phosphorus < 30) {
        insights.push({
            type: 'INFO',
            title: 'Phosphorus Deficiency',
            message: 'Low phosphorus detected. This may affect root development and flowering.',
            action: 'Apply P-Fertilizer'
        });
    }

    // Water Level (Distance)
    if (distance > 25) {
        insights.push({
            type: 'CRITICAL',
            title: 'Water Tank Low',
            message: 'Main water tank is nearly empty. Refill soon to maintain irrigation capacity.',
            action: 'Refill Water Tank'
        });
    }

    // Humidity Logic
    if (humidity > 85) {
        insights.push({
            type: 'WARNING',
            title: 'High Humidity Alert',
            message: 'High humidity increases risk of fungal diseases. Ensure proper ventilation.',
            action: 'Check Airflow'
        });
    } else if (humidity < 30) {
        insights.push({
            type: 'INFO',
            title: 'Low Humidity detected',
            message: 'Low humidity can increase transpiration. Monitor soil moisture closely.',
            action: 'Monitor Soil'
        });
    }

    return insights;
};

const analyzeImage = async (imageBuffer) => {
    // Simulated plant validation logic
    // In a real scenario, we would use a binary classifier (Plant vs No-Plant)
    const isPlant = Math.random() > 0.2; // 80% chance it's a plant for demo purposes

    if (!isPlant) {
        return {
            classification: 'No Plant Detected',
            confidence: 0,
            risk: 'N/A',
            isPlant: false,
            timestamp: new Date().toISOString(),
            recommendations: [
                'Please take a clear photo of your crop or leaf',
                'Ensure the plant is well-lit and in focus',
                'Avoid capturing people or background objects'
            ]
        };
    }

    const diseases = [
        { classification: 'Tomato - Early Blight', confidence: 94.2, risk: 'High', cropHealth: 'Poor' },
        { classification: 'Corn - Rust', confidence: 88.7, risk: 'Medium', cropHealth: 'Fair' },
        { classification: 'Wheat - Septoria', confidence: 91.5, risk: 'Medium', cropHealth: 'Fair' },
        { classification: 'Healthy Leaf', confidence: 98.1, risk: 'None', cropHealth: 'Excellent' }
    ];

    const randomResult = diseases[Math.floor(Math.random() * diseases.length)];
    
    return {
        ...randomResult,
        isPlant: true,
        timestamp: new Date().toISOString(),
        suggestions: [
            'Improve air circulation between plants',
            'Remove and destroy infected leaves',
            'Avoid overhead watering',
            'Apply recommended fungicide if symptoms persist'
        ],
        recommendations: [
            'Isolate affected plants immediately',
            'Maintain a 4-hour monitoring cycle',
            'Check surrounding plants for similar spots'
        ],
        riskScore: randomResult.risk === 'High' ? 85 : randomResult.risk === 'Medium' ? 45 : 10
    };
};

module.exports = {
    generateInsights,
    analyzeImage
};
