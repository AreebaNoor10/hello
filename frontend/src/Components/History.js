'use client'
import { Box, Typography, Alert, IconButton } from '@mui/material';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useState, useEffect } from 'react';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/navigation';

export default function History() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [fileData, setFileData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 7;
  
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/proxy/history');
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch history data');
        }

        if (data.err_status) {
          setError(data.err_message || 'An unknown error occurred');
          setFileData([]);
        } else {
          setFileData(data.data.history_response || []);
          setError(null);
        }
      } catch (err) {
        setError(err.message);
        setFileData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  // Calculate total pages
  const totalItems = fileData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page items
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fileData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show pages 1, 2, 3
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis if needed
    if (totalPages > 3) {
      pageNumbers.push('...');
      
      // Add some pages near the end
      if (totalPages > 5) {
        pageNumbers.push(totalPages - 1);
        pageNumbers.push(totalPages);
      } else {
        // Add remaining pages for small total page counts
        for (let i = 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

  // Get column names from the first item in the data
  const getColumns = () => {
    if (fileData.length === 0) return [];
    const firstItem = fileData[0];
    return Object.keys(firstItem); // Include all columns including record_id
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const columns = getColumns();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      p: { xs: 2, sm: 3 }
    }}>
      {error ? (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            '& .MuiAlert-message': {
              fontSize: '14px'
            }
          }}
        >
          {error}
        </Alert>
      ) : fileData.length === 0 ? (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2,
            '& .MuiAlert-message': {
              fontSize: '14px'
            }
          }}
        >
          No history records found.
        </Alert>
      ) : (
        <>
      {/* Table Container */}
      <div className="w-full rounded-lg bg-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                    {columns.map((column, index) => (
                      <th key={index} className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                        {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </th>
                    ))}
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentItems.map((row, index) => (
                <tr key={index} className="border-t border-gray-200">
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="py-4 px-6 text-sm text-gray-800 whitespace-nowrap">
                          {column === 'status' ? (
                            row[column] === 'completed' ? (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', padding: '2px 12px', borderRadius: 16,
                                background: '#e6f4ea', color: '#188038', fontWeight: 500, fontSize: 14, border: '1px solid #b7e1cd', verticalAlign: 'middle'
                              }}>
                                <span style={{ fontSize: 16, marginRight: 6 }}>✅</span> Completed
                              </span>
                            ) : row[column] === 'inprogress' ? (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', padding: '2px 12px', borderRadius: 16,
                                background: '#e8f0fe', color: '#1a73e8', fontWeight: 500, fontSize: 14, border: '1px solid #c2d7f5', verticalAlign: 'middle'
                              }}>
                                <span style={{ fontSize: 16, marginRight: 6 }}>⏳</span> Processing
                              </span>
                            ) : row[column] === 'review' ? (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', padding: '2px 12px', borderRadius: 16,
                                background: '#fff4e5', color: '#e58900', fontWeight: 500, fontSize: 14, border: '1px solid #ffe0b2', verticalAlign: 'middle'
                              }}>
                                <span style={{ fontSize: 16, marginRight: 6 }}>⚠️</span> Review
                              </span>
                            ) : row[column] === 'draft' ? (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', padding: '2px 12px', borderRadius: 16,
                                background: '#f3f4f6', color: '#5f6368', fontWeight: 500, fontSize: 14, border: '1px solid #e0e0e0', verticalAlign: 'middle'
                              }}>
                                <span style={{ fontSize: 16, marginRight: 6 }}>📝</span> Draft
                              </span>
                            ) : row[column]
                          ) : (
                            row[column]
                          )}
                        </td>
                      ))}
                      <td className="py-4 px-6 text-sm text-gray-800 whitespace-nowrap">
                        <IconButton
                          size="small"
                          onClick={async () => {
                            try {
                              // Log status and ID based on status value
                              if (row.status === 'review') {
                                console.log('MTR ID:', row.record_id);
                                console.log('Status:', row.status);
                                
                                const formData = new FormData();
                                formData.append('record_id', row.record_id);
                                
                                const response = await fetch('/api/proxy/existingfinalreport', {
                                  method: 'POST',
                                  body: formData
                                });
                                
                                const data = await response.json();
                                console.log('Existing Final Report Response:', data);

                                if (data.err_status) {
                                  setError(data.err_message || 'Failed to fetch comparison report');
                                  return;
                                }
                                
                                // Store the complete response data for FinalReportTable
                                localStorage.setItem('finalReportData', JSON.stringify(data.data));
                                localStorage.setItem('mtrId', row.record_id);
                                
                                // Store the same data for mtrResponse to maintain consistency
                                localStorage.setItem('mtrResponse', JSON.stringify({
                                  decision: data.data.decision || {
                                    heat_number: '',
                                    lot_number: '',
                                    raw_material_size: '',
                                    strength: '',
                                    type: ''
                                  },
                                  mds_name: data.data.mds_name || '',
                                  pdf_text: data.data.pdf_text || '',
                                  record_id: row.record_id
                                }));
                                localStorage.setItem('activeStep', '6'); // Set step 7 (index 6)
                                
                                router.push('/');
                                return;
                              }
                              
                              console.log('PDF ID:', row.record_id);
                              console.log('Status:', row.status);
                              
                              const formData = new FormData();
                              formData.append('record_id', row.record_id);
                              
                              const response = await fetch('/api/proxy/recordview', {
                                method: 'POST',
                                body: formData
                              });
                              
                              const data = await response.json();
                              console.log('Record View API Response:', data);

                              if (data.err_status) {
                                setError(data.err_message || 'Failed to fetch record');
                                return;
                              }
                              
                              // Store the response data directly
                              localStorage.setItem('mtrResponse', JSON.stringify({
                                decision: data.data.decision || {
                                  heat_number: '',
                                  lot_number: '',
                                  raw_material_size: '',
                                  strength: '',
                                  type: ''
                                },
                                mds_name: data.data.mds_name || '',
                                pdf_text: data.data.pdf_text || '',
                                record_id: row.record_id
                              }));
                              
                              // Store additional required data
                              localStorage.setItem('mtrMdsName', data.data.mds_name || '');
                              localStorage.setItem('mtrType', data.data.decision?.type || '');
                              
                              // Set to step 2 (index 1)
                              localStorage.setItem('activeStep', '1');
                              
                              // Navigate to dashboard
                              router.push('/');
                            } catch (error) {
                              console.error('API Error:', error);
                              setError(error.message || 'An error occurred while processing your request');
                            }
                          }}
                          sx={{
                            color: '#5f6368',
                            '&:hover': {
                              color: '#4285f4',
                              bgcolor: '#e8f0fe'
                            }
                          }}
                        >
                          <RemoveRedEyeOutlinedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 2,
        px: 1
      }}>
        <Typography variant="body2" color="text.secondary">
          Show {Math.min(currentItems.length, itemsPerPage)} out of {totalItems}
        </Typography>
        
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <button 
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 1}
            className="flex items-center justify-center h-6 w-6 rounded text-gray-600 bg-white hover:bg-gray-100"
          >
            <NavigateBeforeIcon sx={{ fontSize: 18 }} />
          </button>
          
          {/* Page numbers */}
          {getPageNumbers().map((pageNum, index) => (
            <button 
              key={index}
              onClick={() => typeof pageNum === 'number' ? handleChangePage(pageNum) : null}
              className={`flex items-center justify-center h-6 w-6 text-xs rounded-sm ${
                pageNum === page 
                  ? 'bg-gray-800 text-white' 
                  : pageNum === '...' 
                    ? 'bg-transparent text-gray-600 cursor-default' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          {/* Next button */}
          <button 
            onClick={() => handleChangePage(page + 1)}
            disabled={page === totalPages}
            className="flex items-center justify-center h-6 w-6 rounded text-gray-600 bg-white hover:bg-gray-100"
          >
            <NavigateNextIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </Box>
        </>
      )}
    </Box>
  );
}


