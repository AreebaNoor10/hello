export async function PUT(request) {
  try {
    const requestData = await request.json();
    console.log('Update report request data:', requestData);

    const response = await fetch('http://20.205.169.17:3002/update_report', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    const responseData = await response.json();
    console.log('Update report API response:', responseData);

    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in update-report API route:', error);
    return new Response(JSON.stringify({
      err_status: true,
      err_message: error.message || 'An error occurred while updating the report',
      data: null
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
