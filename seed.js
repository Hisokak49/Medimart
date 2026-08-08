import mongoose from 'mongoose';
import dns from 'dns';
import 'dotenv/config';
import Product from './models/Product.js';

// Set global DNS servers to Google DNS to bypass local SRV blocking
dns.setServers(['8.8.8.8', '8.8.4.4']);

const sampleMedicines = [
    {
        name: "Amoxicillin 500mg",
        description: "Broad-spectrum penicillin antibiotic used to treat bacterial infections such as pneumonia, tonsillitis, and ear infections. Follow prescription instructions carefully.",
        price: 18.50,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
        category: "Antibiotics",
        stock: 120
    },
    {
        name: "Paracetamol 500mg",
        description: "Effective fever reducer and pain reliever used for headaches, muscle aches, arthritis, backaches, toothaches, and colds.",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=60",
        category: "Pain Relief",
        stock: 500
    },
    {
        name: "Ibuprofen 400mg",
        description: "Nonsteroidal anti-inflammatory drug (NSAID) used to reduce hormones that cause pain and inflammation in the body.",
        price: 6.25,
        image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60",
        category: "Pain Relief",
        stock: 350
    },
    {
        name: "Atorvastatin (Lipitor) 20mg",
        description: "Statin medication used to prevent cardiovascular disease in those at high risk and lower abnormal lipid levels.",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
        category: "Cardiology",
        stock: 80
    },
    {
        name: "Vitamin C 1000mg",
        description: "Premium dietary supplement supporting immune health, antioxidant protection, and collagen production. Essential daily wellness.",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1616679911721-fe6eec18fcd5?w=500&auto=format&fit=crop&q=60",
        category: "Vitamins",
        stock: 250
    },
    {
        name: "First Aid Emergency Kit",
        description: "Comprehensive 120-piece medical response kit containing bandages, antiseptics, sterile gauze, burn treatments, and surgical tape.",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60",
        category: "First Aid",
        stock: 45
    }
];

const seedDB = async () => {
    try {
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }
        
        console.log('Connecting to database...');
        await mongoose.connect(dbUri);
        console.log('Database connected.');

        // Clear existing products
        console.log('Clearing existing product inventory...');
        await Product.deleteMany({});

        // Insert new products
        console.log('Seeding products...');
        await Product.insertMany(sampleMedicines);
        
        console.log('Database successfully seeded with medicine catalog!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    }
};

seedDB();
