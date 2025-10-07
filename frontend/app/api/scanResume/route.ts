// app/api/scanResume/route.ts

import { NextResponse } from 'next/server';

// Define the expected structure of the response from your external backend
interface BackendResponse {
    bestFitRole: string; // Corresponds to Flask's "best_role"
    recommendedSkills: string[]; // Corresponds to Flask's "recommend_next"
    otherPossibleRoles: string[]; // Corresponds to Flask's "other_roles"
}

// ⚠️ KEY CHANGE 1: Match the Flask URL and endpoint
const YOUR_EXTERNAL_BACKEND_URL = process.env.AI_SCAN_ENDPOINT || 'http://localhost:5001/check_resume'; 

// Route Handler for POST requests
export async function POST(request: Request) {
    // 1. Get the form data from the incoming request
    const formData = await request.formData();
    // Frontend sends the file under the key 'resume'
    const resumeFile = formData.get('resume'); 

    if (!resumeFile || !(resumeFile instanceof File)) {
        return NextResponse.json({ message: 'No resume file uploaded or file is invalid.' }, { status: 400 });
    }

    // 2. Prepare the data to be sent to your external backend
    const proxyFormData = new FormData();
    // ⚠️ KEY CHANGE 2: Flask expects the file under the key 'resume' (not 'file')
    proxyFormData.append('resume', resumeFile); 

    try {
        // 3. Forward the request to your external AI backend
        const backendResponse = await fetch(YOUR_EXTERNAL_BACKEND_URL, {
            method: 'POST',
            body: proxyFormData,
        });

        // 4. Handle errors from the Flask backend
        if (!backendResponse.ok) {
            const backendError = await backendResponse.text();
            console.error("External Backend Error:", backendError);
            return NextResponse.json(
                { message: `Analysis failed. Backend status: ${backendResponse.status}` }, 
                { status: backendResponse.status }
            );
        }

        // 5. Parse the successful response from Flask
        const flaskData = await backendResponse.json();

        // 6. ⚠️ KEY CHANGE 3: Map Flask's snake_case keys to TypeScript's camelCase keys
        const responseData: BackendResponse = {
            bestFitRole: flaskData.best_role,
            recommendedSkills: flaskData.recommend_next,
            otherPossibleRoles: flaskData.other_roles,
        };

        // 7. Return the data to the frontend
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ 
            message: 'Internal Server Error during file forwarding.' 
        }, { status: 500 });
    }
}