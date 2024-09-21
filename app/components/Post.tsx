"use client";

import { useRef, useState } from "react";

// Importing React hooks and components
import { QuillEditor, quillModules, quillFormats } from "./QuillEditor";
import "react-quill/dist/quill.snow.css";

import {useMakeCopilotReadable,useCopilotAction}  from "@copilotkit/react-core";

import {
  CopilotTextarea,
  HTMLCopilotTextAreaElement
} from "@copilotkit/react-textarea";



// Define the CreatePost component
export default function CreatePost() {
  // Initialize state variables for article outline, copilot text, and article title
  const [articleOutline, setArticleOutline] = useState("");
  const [copilotText, setCopilotText] = useState("");
  const [articleTitle, setArticleTitle] = useState("");

  // State variable to track if research task is running
  const [publishTaskRunning, setPublishTaskRunning] = useState(false);

  // Handle changes to the editor content
  const handleEditorChange = (newContent) => {
    setCopilotText(newContent);
  };

  // Ensure useMakeCopilotReadable is called correctly
  const readableContent = useMakeCopilotReadable(
    "Blog article outline: " + JSON.stringify(articleOutline)
  );

  const copilotTextareaRef = useRef<HTMLCopilotTextAreaElement>(null);

  // Define a Copilot action
  useCopilotAction(
    {
      // Action name and description
      name: "researchBlogArticleTopic",
      description: "Research a given topic for a blog article.",
  
      // Parameters for the action
      parameters: [
        {
          // Parameter 1: articleTitle
          name: "articleTitle",
          type: "string",
          description: "Title for a blog article.",
          required: true, // This parameter is required
        },
        {
          // Parameter 2: articleOutline
          name: "articleOutline",
          type: "string",
          description: "Outline for a blog article that shows what the article covers.",
          required: true, // This parameter is required
        },
      ],
  
      // Handler function for the action
      handler: async ({ articleOutline, articleTitle }) => {
        // Set the article outline and title using state setters
        setArticleOutline(articleOutline);
        setArticleTitle(articleTitle);
      },
    },
    [] // Dependencies (empty array means no dependencies)
  );   

  // Define the async function for the submit button
  const handleSubmit = async () => {
    try {
      setPublishTaskRunning(true);
      // Add your publish logic here
    } finally {
      setPublishTaskRunning(false);
    }
  };

  return (
    <>
      {/* Main */}
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-white text-3xl my-7 font-semibold">
          Create a post
        </h1>

        {/* Form for creating a post */}
        <form action={""} className="flex flex-col gap-4 mb-2 mt-2">
          <div className="flex flex-col gap-4 sm:flex-row justify-between mb-2">
            {/* Input field for article title */}
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              value={articleTitle}
              onChange={(event) => setArticleTitle(event.target.value)}
              className="flex-1 block w-full rounded-lg border text-sm border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
            <CopilotTextarea
              className="p-4 h-72 w-full rounded-lg mb-2 border text-sm border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
              ref={copilotTextareaRef}
              placeholder="Start typing for content autosuggestion."
              value={articleOutline}
              onChange={(event) => setArticleOutline(event.target.value)}
              rows={5}
              autosuggestionsConfig={{
                textareaPurpose: articleTitle,
                chatApiConfigs: {
                  suggestionsApiConfig: {
                    forwardedParams: {
                      max_tokens: 5,
                      stop: ["\n", ".", ","],
                    },
                  },
                  insertionApiConfig: {},
                },
                debounceTime: 250,
              }}
            />
          </div>

          {/* Hidden textarea for article content */}
          <textarea
            className="p-4 w-full aspect-square font-bold text-xl bg-slate-800 text-white rounded-lg resize-none hidden"
            id="content"
            name="content"
            value={copilotText}
            placeholder="Write your article content here"
            onChange={(event) => setCopilotText(event.target.value)}
          />

          {/* Quill editor component */}
          <QuillEditor
            value={copilotText}
            onChange={handleEditorChange}
            modules={quillModules}
            formats={quillFormats}
            className="h-80 mb-12 text-white"
          />
          {/* Submit button for publishing the post */}
          <button
            type="button"
            disabled={publishTaskRunning}
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
              publishTaskRunning
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
            onClick={handleSubmit}>
            {publishTaskRunning ? "Publishing..." : "Publish"}
          </button>
        </form>
      </div>
    </>
  );
}
