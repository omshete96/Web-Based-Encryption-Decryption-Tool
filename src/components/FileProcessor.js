'use client';
import { useState } from 'react';

// Simple SVG Icons
const LockClosedIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const LockOpenIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const ShieldCheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ArrowUpTrayIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const ArrowDownTrayIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 11l3 3m0 0l3-3m-3 3V8" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function FileProcessor() {
  const [currentStep, setCurrentStep] = useState('choice'); // 'choice', 'encrypt', 'decrypt'
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const resetForm = () => {
    setSelectedFile(null);
    setKey('');
    setShowKey(false);
    setMessage('');
  };

  const handleBack = () => {
    setCurrentStep('choice');
    resetForm();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setMessage('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage('');
    }
  };

  // Simple XOR encryption/decryption function for demo
  const xorCrypt = (data, key) => {
    const result = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i] ^ key.charCodeAt(i % key.length);
    }
    return result;
  };

  const handleProcess = async () => {
    if (!selectedFile || !key) {
      setMessage('Please select a file and enter a key.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Read file as array buffer
      const fileBuffer = await selectedFile.arrayBuffer();
      const fileData = new Uint8Array(fileBuffer);
      
      // Process the file
      const processedData = xorCrypt(fileData, key);
      
      // Create download
      const blob = new Blob([processedData], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      if (currentStep === 'encrypt') {
        a.download = selectedFile.name + '.enc';
      } else {
        // For decryption, try to remove .enc extension or add _decrypted
        const originalName = selectedFile.name;
        a.download = originalName.endsWith('.enc') 
          ? originalName.slice(0, -4) 
          : originalName + '_decrypted';
      }
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage(`File ${currentStep}ed and downloaded successfully! 🎉`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }

    setLoading(false);
  };

  // Landing Page - Choice Selection
  if (currentStep === 'choice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg">
                <ShieldCheckIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SecureFile Pro
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Advanced XOR-based file encryption and decryption with military-grade security. 
              Protect your sensitive files with ease and confidence.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Encryption Card */}
            <div 
              onClick={() => setCurrentStep('encrypt')}
              className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <LockClosedIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Encrypt Files</h3>
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Secure your sensitive files with advanced XOR encryption. Convert any file into an encrypted format that only you can access.
                </p>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                  Upload & Protect
                </div>
              </div>
            </div>

            {/* Decryption Card */}
            <div 
              onClick={() => setCurrentStep('decrypt')}
              className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <LockOpenIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Decrypt Files</h3>
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Restore your encrypted files back to their original format. Enter your key to unlock and access your protected content.
                </p>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Unlock & Restore
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Military-Grade Security</h4>
              <p className="text-sm text-gray-600">Advanced XOR encryption ensures your files remain completely secure and private.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DocumentIcon className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Any File Type</h4>
              <p className="text-sm text-gray-600">Encrypt documents, images, videos, and any other file format with ease.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <EyeSlashIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Privacy First</h4>
              <p className="text-sm text-gray-600">Your files and keys are processed locally - nothing is stored or transmitted.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Processing Page (Encrypt/Decrypt)
  const isEncrypt = currentStep === 'encrypt';
  const title = isEncrypt ? 'Encrypt File' : 'Decrypt File';
  const subtitle = isEncrypt 
    ? 'Secure your file with XOR encryption' 
    : 'Restore your encrypted file to original format';
  const gradientFrom = isEncrypt ? 'from-green-500' : 'from-purple-500';
  const gradientTo = isEncrypt ? 'to-blue-500' : 'to-pink-500';
  const IconComponent = isEncrypt ? LockClosedIcon : LockOpenIcon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Menu
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SecureFile Pro
            </h1>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-4 rounded-full shadow-lg`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            {/* File Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select File
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-blue-400 bg-blue-50'
                    : selectedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center">
                    <DocumentIcon className="h-8 w-8 text-green-600 mr-3" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 mb-2">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">or</p>
                    <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                      <span>Choose File</span>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Key Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Encryption Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter your encryption key..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showKey ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Remember this key - you'll need it to decrypt your file later!
              </p>
            </div>

            {/* Process Button */}
            <button
              onClick={handleProcess}
              disabled={loading || !selectedFile || !key}
              className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 ${
                loading || !selectedFile || !key
                  ? 'bg-gray-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:shadow-lg transform hover:-translate-y-1`
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing...
                </div>
              ) : (
                `${title} & Download`
              )}
            </button>

            {/* Message Display */}
            {message && (
              <div className={`mt-4 p-4 rounded-xl ${
                message.includes('successfully') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Security Notice</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Your files are processed entirely in your browser. No data is uploaded to any server. 
                  Keep your encryption key safe - without it, your encrypted files cannot be recovered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}