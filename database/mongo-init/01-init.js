// MongoDB initialization script for TestAssistant
print("Starting MongoDB initialization...");

db = db.getSiblingDB('testassistant');

// Check if collections already exist to avoid re-initialization
if (!db.getCollectionNames().includes('test_submissions')) {
    print("Creating collections...");
    
    // Create collections with validation
    db.createCollection('test_submissions', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["student_id", "test_id", "submitted_at"],
                properties: {
                    student_id: { bsonType: "int" },
                    test_id: { bsonType: "int" },
                    submitted_at: { bsonType: "date" },
                    scanned_files: { bsonType: "array" },
                    raw_ocr_text: { bsonType: "string" },
                    processed_answers: { bsonType: "object" },
                    ai_grading_results: { bsonType: "object" },
                    final_score: { bsonType: "double" }
                }
            }
        }
    });
    
    db.createCollection('feedback', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["student_id", "test_id", "question_id", "feedback_text"],
                properties: {
                    student_id: { bsonType: "int" },
                    test_id: { bsonType: "int" },
                    question_id: { bsonType: "int" },
                    feedback_text: { bsonType: "string" },
                    generated_at: { bsonType: "date" },
                    learning_resources: { bsonType: "array" }
                }
            }
        }
    });
    
    // Create indexes for better query performance
    db.test_submissions.createIndex({ student_id: 1, test_id: 1 }, { unique: true });
    db.feedback.createIndex({ student_id: 1, test_id: 1, question_id: 1 });
    
    print("MongoDB collections and indexes created successfully");
} else {
    print("MongoDB collections already exist, skipping initialization");
} 