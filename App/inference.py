import joblib

# Load the TfidfVectorizer
vectorizer = joblib.load('models/tfidf_vectorizer.pkl')

# Load the SVC model
svm_model = joblib.load('models/svm_model.pkl')

def predict(text):
    new_data_tfidf = vectorizer.transform(text).toarray()
    predictions = svm_model.predict(new_data_tfidf)

    if predictions == 1:
        return 'Spam'
    else:
        return 'Not Spam'
    
if __name__ == "__main__":
    import pandas as pd

    text = "Congratulations! Thanks to a good friend U have WON the £2,000 Xmas prize. 2 claim is easy, just call 08718726971 NOW! Only 10p per minute. BT-national-rate."

    print('Original:', text)
    print('Predicted:', predict([text]))
