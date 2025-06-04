#include <iostream> 
#include <fstream>
#include <vector>
#include <string>
#include <limits>
#include <cstdint>

using namespace std;

// Function to perform XOR encryption/decryption
void xorCipher(vector<char>& data, const string& key) {
    size_t keyLength = key.size();
    for (size_t i = 0; i < data.size(); ++i) {
        data[i] ^= key[i % keyLength];
    }
}

// Function to read a file into a vector<char>
bool readFile(const string& filename, vector<char>& data) {
    ifstream inFile(filename, ios::binary);
    if (!inFile) {
        cerr << "Error: Cannot open input file \"" << filename << "\".\n";
        return false;
    }

    // Read file into vector
    inFile.seekg(0, ios::end);
    streamsize size = inFile.tellg();
    if (size < 0) {
        cerr << "Error: Failed to read the file size.\n";
        return false;
    }
    inFile.seekg(0, ios::beg);

    data.resize(static_cast<size_t>(size));
    if (!inFile.read(data.data(), size)) {
        cerr << "Error: Failed to read the file data.\n";
        return false;
    }

    inFile.close();
    return true;
}

// Function to write a vector<char> to a file
bool writeFile(const string& filename, const vector<char>& data) {
    ofstream outFile(filename, ios::binary);
    if (!outFile) {
        cerr << "Error: Cannot open output file \"" << filename << "\".\n";
        return false;
    }

    outFile.write(data.data(), data.size());
    if (!outFile) {
        cerr << "Error: Failed to write data to file.\n";
        return false;
    }

    outFile.close();
    return true;
}

// Function to extract the filename from a full path
string extractFilename(const string& filepath) {
    size_t pos = filepath.find_last_of("/\\");
    if (pos == string::npos)
        return filepath; // No directory component
    else
        return filepath.substr(pos + 1);
}

// Function to convert size_t to 4-byte little endian
vector<char> sizeToBytes(uint32_t size) {
    vector<char> bytes(4);
    bytes[0] = size & 0xFF;
    bytes[1] = (size >> 8) & 0xFF;
    bytes[2] = (size >> 16) & 0xFF;
    bytes[3] = (size >> 24) & 0xFF;
    return bytes;
}

// Function to convert 4-byte little endian to uint32_t
uint32_t bytesToSize(const vector<char>& bytes, size_t start) {
    if (start + 4 > bytes.size()) return 0;
    uint32_t size = 0;
    size |= static_cast<unsigned char>(bytes[start]);
    size |= static_cast<unsigned char>(bytes[start + 1]) << 8;
    size |= static_cast<unsigned char>(bytes[start + 2]) << 16;
    size |= static_cast<unsigned char>(bytes[start + 3]) << 24;
    return size;
}

bool encryptFile(const string& inputFile, const string& outputFile, const string& key) {
    // Extract the original filename from the input path
    string originalFilename = extractFilename(inputFile);

    if (key.empty()) {
        cerr << "Error: Key cannot be empty.\n";
        return false;
    }

    vector<char> inputData;
    if (!readFile(inputFile, inputData)) {
        cerr << "Encryption failed due to input file error.\n";
        return false;
    }

    // Create header
    uint32_t filenameLength = static_cast<uint32_t>(originalFilename.size());
    vector<char> header = sizeToBytes(filenameLength);
    header.insert(header.end(), originalFilename.begin(), originalFilename.end());

    // Concatenate header and data
    vector<char> combinedData = header;
    combinedData.insert(combinedData.end(), inputData.begin(), inputData.end());

    // Encrypt the combined data
    xorCipher(combinedData, key);

    if (!writeFile(outputFile, combinedData)) {
        cerr << "Encryption failed due to output file error.\n";
        return false;
    }

    cout << "Encryption successful! Encrypted file saved as \"" << outputFile << "\".\n";
    return true;
}

bool decryptFile(const string& inputFile, const string& outputDir, const string& key) {
    if (key.empty()) {
        cerr << "Error: Key cannot be empty.\n";
        return false;
    }

    vector<char> inputData;
    if (!readFile(inputFile, inputData)) {
        cerr << "Decryption failed due to input file error.\n";
        return false;
    }

    // Decrypt the data
    xorCipher(inputData, key);

    // Extract header
    if (inputData.size() < 4) {
        cerr << "Error: Encrypted file is corrupted or not in the correct format.\n";
        return false;
    }

    uint32_t filenameLength = bytesToSize(inputData, 0);
    if (filenameLength == 0 || 4 + filenameLength > inputData.size()) {
        cerr << "Error: Invalid filename length in encrypted file.\n";
        return false;
    }

    string originalFilename(inputData.begin() + 4, inputData.begin() + 4 + filenameLength);

    // Extract file data
    vector<char> fileData(inputData.begin() + 4 + filenameLength, inputData.end());

    // Construct full output file path
    string outputFilePath = outputDir;
    if (!outputDir.empty() && outputDir.back() != '/' && outputDir.back() != '\\') {
        outputFilePath += "/";
    }
    outputFilePath += originalFilename;

    if (!writeFile(outputFilePath, fileData)) {
        cerr << "Decryption failed due to output file error.\n";
        return false;
    }

    cout << "Decryption successful! Decrypted file saved as \"" << outputFilePath << "\".\n";
    return true;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cerr << "Usage:\n";
        cerr << "  Encrypt: " << argv[0] << " encrypt <input_file> <output_file> <key>\n";
        cerr << "  Decrypt: " << argv[0] << " decrypt <input_file> <output_dir> <key>\n";
        return 1;
    }

    string operation = argv[1];
    
    if (operation == "encrypt") {
        if (argc != 5) {
            cerr << "Usage: " << argv[0] << " encrypt <input_file> <output_file> <key>\n";
            return 1;
        }
        
        string inputFile = argv[2];
        string outputFile = argv[3];
        string key = argv[4];
        
        if (encryptFile(inputFile, outputFile, key)) {
            return 0;
        } else {
            return 1;
        }
    }
    else if (operation == "decrypt") {
        if (argc != 5) {
            cerr << "Usage: " << argv[0] << " decrypt <input_file> <output_dir> <key>\n";
            return 1;
        }
        
        string inputFile = argv[2];
        string outputDir = argv[3];
        string key = argv[4];
        
        if (decryptFile(inputFile, outputDir, key)) {
            return 0;
        } else {
            return 1;
        }
    }
    else {
        cerr << "Invalid operation. Use 'encrypt' or 'decrypt'.\n";
        return 1;
    }
}