import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const mtr_id = formData.get('mtr_id');


    // Make the request to the external API
    const response = await fetch('http://20.205.169.17:3002/get_matched_unified_specs', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `record_id=${mtr_id}`,
    });

    const data = await response.json();
    console.log('Get Unified Output API Response:', data);
    
    return Response.json(data);
  } catch (error) {
    console.error('Error in get unified output API:', error);
    return Response.json({ error: error.message });
  }
}
