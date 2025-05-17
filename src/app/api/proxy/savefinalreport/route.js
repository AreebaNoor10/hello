export async function PUT(request) {
  try {
    // Get form data from request
    const formData = await request.formData();
    const record_id = formData.get('record_id');
    
    console.log('Save final report request data:', { record_id });

    // Create URL-encoded form data
    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append('record_id', record_id);

    const response = await fetch('http://20.205.169.17:3002/save_final_report/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      },
      body: urlEncodedData.toString()
    });

    const responseData = await response.json();
    console.log('Save final report API response:', responseData);

    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in savefinalreport API route:', error);
    return new Response(JSON.stringify({
      err_status: true,
      err_message: error.message || 'An error occurred while saving the final report',
      data: null
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
