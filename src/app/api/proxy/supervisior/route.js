import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Log the form data to verify contents
    console.log('Form data keys:', [...formData.keys()]);
    
    // Ensure required fields exist
    if (!formData.has('file') || !formData.has('mds_name')) {
      console.error('Missing required form fields');
      return NextResponse.json(
        { error: 'Missing required fields: file or mds_name' },
        { status: 400 }
      );
    }
    
    // Log file info
    const file = formData.get('file');
    console.log('File name:', file.name, 'File type:', file.type, 'File size:', file.size);
    
    const response = await fetch('http://20.205.169.17:3002/get_supervisor_response', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API responded with status ${response.status}:`, errorText);
      return NextResponse.json(
        { error: `External API error: ${response.status} ${response.statusText}`, detail: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Supervisor Decision API Response:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in supervisor decision API:', error);
    return NextResponse.json(
      { error: 'Failed to process supervisor decision', message: error.message },
      { status: 500 }
    );
  }
}
