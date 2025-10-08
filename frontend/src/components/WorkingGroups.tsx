// =====================================
// frontend/src/components/WorkingGroups.tsx
// =====================================

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Search, 
  FileText, 
  Users, 
  Database, 
  Brain, 
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

interface WorkingGroup {
  id: string;
  name: string;
  description: string;
  domain: string;
  status: 'active' | 'inactive' | 'archived';
  configuration: {
    ragContainer: {
      containerId: string;
      vectorDatabase: string;
      embeddingModel: string;
      chunkSize: number;
      chunkOverlap: number;
      similarityThreshold: number;
      maxResults: number;
      crossGroupSearch: boolean;
    };
    modelSettings: {
      primaryModel: string;
      fallbackModels: string[];
      modelProvider: string;
      temperature: number;
      maxTokens: number;
    };
    privacySettings: {
      privacyLevel: 'maximum' | 'high' | 'selective' | 'minimal';
      dataRetention: number;
      anonymizationRequired: boolean;
      encryptionRequired: boolean;
      crossGroupSharing: boolean;
      auditLogging: boolean;
    };
    intelligenceDisclosure: {
      enabled: boolean;
      disclosureLevel: 'full' | 'partial' | 'minimal';
      includeModelInfo: boolean;
      includeProcessingSteps: boolean;
      includeSourceAttribution: boolean;
      includeConfidenceScores: boolean;
      includeReasoningChain: boolean;
    };
    documentProcessing: {
      supportedFormats: string[];
      maxFileSize: number;
      autoProcessing: boolean;
      qualityThreshold: number;
      duplicateDetection: boolean;
      versionControl: boolean;
      metadataExtraction: boolean;
      contentValidation: boolean;
    };
  };
  metadata: {
    created: string;
    updated: string;
    createdBy: string;
    participantCount: number;
    documentCount: number;
    lastActivity: string;
  };
}

interface DocumentUpload {
  id: string;
  workingGroupId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  content: string;
  metadata: {
    title: string;
    author?: string;
    source?: string;
    tags: string[];
    language: string;
    category: string;
    version: string;
    license?: string;
    customFields: { [key: string]: any };
  };
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  processingResults: {
    chunks: any[];
    embeddings: number[][];
    summary: string;
    keywords: string[];
    entities: any[];
    qualityScore: number;
    processingTime: number;
    modelUsed: string;
    processingSteps: any[];
  };
  intelligenceDisclosure: {
    modelInfo: {
      primaryModel: string;
      fallbackModels: string[];
      modelProvider: string;
      parameters: any;
      version: string;
      capabilities: string[];
    };
    processingSteps: any[];
    sourceAttribution: any[];
    confidenceScores: {
      overall: number;
      factual: number;
      contextual: number;
      temporal: number;
      source: number;
      reasoning: number;
    };
    reasoningChain: any[];
    metadata: {
      generatedAt: string;
      disclosureLevel: string;
      workingGroupId: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface QueryResult {
  response: string;
  sources: Array<{
    id: string;
    title: string;
    content: string;
    score: number;
    accessLevel: string;
  }>;
  intelligenceDisclosure?: any;
  metadata: {
    workingGroupId: string;
    modelUsed: string;
    processingTime: number;
    confidence: number;
  };
}

const WorkingGroups: React.FC = () => {
  const [workingGroups, setWorkingGroups] = useState<WorkingGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<WorkingGroup | null>(null);
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [showDisclosure, setShowDisclosure] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    title: '',
    author: '',
    source: '',
    tags: '',
    language: 'en',
    category: 'general',
    version: '1.0.0',
    license: '',
    customFields: '{}'
  });
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load working groups on component mount
  useEffect(() => {
    loadWorkingGroups();
  }, []);

  // Load documents when selected group changes
  useEffect(() => {
    if (selectedGroup) {
      loadDocuments(selectedGroup.id);
    }
  }, [selectedGroup]);

  const loadWorkingGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/working-groups');
      const data = await response.json();
      
      if (data.success) {
        setWorkingGroups(data.workingGroups);
        if (data.workingGroups.length > 0 && !selectedGroup) {
          setSelectedGroup(data.workingGroups[0]);
        }
      } else {
        setError(data.error || 'Failed to load working groups');
      }
    } catch (err) {
      setError('Failed to load working groups');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (workingGroupId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/working-groups/${workingGroupId}/documents`);
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.documents);
      } else {
        setError(data.error || 'Failed to load documents');
      }
    } catch (err) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !selectedGroup) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('document', uploadFile);
      formData.append('title', uploadMetadata.title);
      formData.append('author', uploadMetadata.author);
      formData.append('source', uploadMetadata.source);
      formData.append('tags', uploadMetadata.tags);
      formData.append('language', uploadMetadata.language);
      formData.append('category', uploadMetadata.category);
      formData.append('version', uploadMetadata.version);
      formData.append('license', uploadMetadata.license);
      formData.append('customFields', uploadMetadata.customFields);
      
      if (selectedModel) {
        formData.append('modelOverride', selectedModel);
      }

      const response = await fetch(`/api/working-groups/${selectedGroup.id}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setError('');
        setUploadFile(null);
        setUploadMetadata({
          title: '',
          author: '',
          source: '',
          tags: '',
          language: 'en',
          category: 'general',
          version: '1.0.0',
          license: '',
          customFields: '{}'
        });
        loadDocuments(selectedGroup.id);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim() || !selectedGroup) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/working-groups/${selectedGroup.id}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          modelOverride: selectedModel || undefined,
          includeDisclosure: true,
          maxResults: 10
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQueryResult(data.result);
        setError('');
      } else {
        setError(data.error || 'Query failed');
      }
    } catch (err) {
      setError('Query failed');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Working Groups</h1>
          <p className="text-gray-600">
            Manage working groups, upload documents, and query RAG containers with model optionality and intelligence disclosure.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Working Groups List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Working Groups
                </h2>
              </div>
              <div className="p-4">
                {workingGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedGroup?.id === group.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <FileText className="w-3 h-3 mr-1" />
                      {group.metadata.documentCount} documents
                      <span className="mx-2">•</span>
                      <Database className="w-3 h-3 mr-1" />
                      {group.configuration.ragContainer.vectorDatabase}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedGroup ? (
              <div className="space-y-6">
                {/* Working Group Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{selectedGroup.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedGroup.description}</p>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Domain:</span>
                        <p className="font-medium">{selectedGroup.domain}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Model:</span>
                        <p className="font-medium">{selectedGroup.configuration.modelSettings.primaryModel}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Privacy:</span>
                        <p className="font-medium capitalize">{selectedGroup.configuration.privacySettings.privacyLevel}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Documents:</span>
                        <p className="font-medium">{selectedGroup.metadata.documentCount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Document
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select File
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        accept=".pdf,.txt,.md,.docx,.html"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={uploadMetadata.title}
                          onChange={(e) => setUploadMetadata({...uploadMetadata, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Author
                        </label>
                        <input
                          type="text"
                          value={uploadMetadata.author}
                          onChange={(e) => setUploadMetadata({...uploadMetadata, author: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={uploadMetadata.tags}
                          onChange={(e) => setUploadMetadata({...uploadMetadata, tags: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Model Override
                        </label>
                        <select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Use default model</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          <option value="gpt-4">GPT-4</option>
                          <option value="claude-3-haiku">Claude 3 Haiku</option>
                          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                          <option value="llama2">Llama 2</option>
                          <option value="phala-gpt">Phala GPT</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleFileUpload}
                      disabled={!uploadFile || loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Upload Document
                    </button>
                  </div>
                </div>

                {/* Query Interface */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      Query RAG Container
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Query
                      </label>
                      <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask a question about the documents in this working group..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={showDisclosure}
                            onChange={(e) => setShowDisclosure(e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Show intelligence disclosure</span>
                        </label>
                      </div>
                      
                      <button
                        onClick={handleQuery}
                        disabled={!query.trim() || loading}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4 mr-2" />
                        )}
                        Query
                      </button>
                    </div>
                  </div>
                </div>

                {/* Query Results */}
                {queryResult && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Brain className="w-5 h-5 mr-2" />
                        Query Results
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Response</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-800 whitespace-pre-wrap">{queryResult.response}</p>
                        </div>
                      </div>

                      {queryResult.sources && queryResult.sources.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Sources</h4>
                          <div className="space-y-2">
                            {queryResult.sources.map((source, index) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-md">
                                <h5 className="font-medium text-gray-900">{source.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{source.content}</p>
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                  <span>Score: {(source.score * 100).toFixed(1)}%</span>
                                  <span className="mx-2">•</span>
                                  <span>Access: {source.accessLevel}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {showDisclosure && queryResult.intelligenceDisclosure && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            Intelligence Disclosure
                          </h4>
                          <div className="bg-blue-50 p-4 rounded-md">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Model:</span>
                                <p className="font-medium">{queryResult.intelligenceDisclosure.modelInfo.primaryModel}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Provider:</span>
                                <p className="font-medium">{queryResult.intelligenceDisclosure.modelInfo.modelProvider}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Confidence:</span>
                                <p className="font-medium">{(queryResult.intelligenceDisclosure.confidenceScores.overall * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Processing Time:</span>
                                <p className="font-medium">{queryResult.metadata.processingTime}ms</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Generated using {queryResult.metadata.modelUsed} with {queryResult.metadata.confidence * 100}% confidence
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Documents ({documents.length})
                    </h3>
                  </div>
                  <div className="p-4">
                    {documents.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
                    ) : (
                      <div className="space-y-3">
                        {documents.map((doc) => (
                          <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{doc.metadata.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{doc.originalName}</p>
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                  <span>{formatFileSize(doc.fileSize)}</span>
                                  <span className="mx-2">•</span>
                                  <span>{doc.mimeType}</span>
                                  <span className="mx-2">•</span>
                                  <span>Quality: {(doc.processingResults.qualityScore * 100).toFixed(1)}%</span>
                                  <span className="mx-2">•</span>
                                  <span>Model: {doc.processingResults.modelUsed}</span>
                                </div>
                                {doc.metadata.tags && doc.metadata.tags.length > 0 && (
                                  <div className="flex flex-wrap mt-2">
                                    {doc.metadata.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-1"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  doc.processingStatus === 'completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : doc.processingStatus === 'processing'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : doc.processingStatus === 'failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {doc.processingStatus}
                                </span>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Working Group Selected</h3>
                <p className="text-gray-600">Select a working group from the list to view documents and query the RAG container.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingGroups;
