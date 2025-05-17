import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const record_id = formData.get('record_id');

    if (!record_id) {
      return NextResponse.json(
        { err_status: true, err_message: 'Record ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch('http://20.205.169.17:3002/fetch_ai_comparison_report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      },
      body: new URLSearchParams({
        record_id: record_id.toString()
      }).toString()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.errorMessage || data.errorType || 'Failed to fetch existing final report');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Existing Final Report API Error:', error);
    return NextResponse.json(
      { err_status: true, err_message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
