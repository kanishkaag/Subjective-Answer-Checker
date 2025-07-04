from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
import os
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('vader_lexicon')

app = Flask(__name__)
CORS(app)

# 🔥 Root route for health check
@app.route('/')
def index():
    return jsonify({"message": "Flask server is running!"})

def preprocess_text(text, use_lemmatization=True, weighted_words=None):
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    tokens = [word.lower() for word in tokens if word.isalnum() and word.lower() not in stop_words]
    if use_lemmatization:
        lemmatizer = WordNetLemmatizer()
        tokens = [lemmatizer.lemmatize(word) for word in tokens]
    if weighted_words:
        tokens += [word for word in tokens if word in weighted_words]
    return set(tokens)

def calculate_similarity(answer1, answer2, weighted_words=None):
    set1 = preprocess_text(answer1, weighted_words=weighted_words)
    set2 = preprocess_text(answer2, weighted_words=weighted_words)
    intersection = set1.intersection(set2)
    union = set1.union(set2)
    jaccard_similarity = len(intersection) / len(union) if len(union) > 0 else 0.0
    length_similarity = len(set1.intersection(set2)) / len(set1.union(set2))
    return jaccard_similarity, length_similarity

def check_synonyms(word1, word2):
    synsets1 = wordnet.synsets(word1)
    synsets2 = wordnet.synsets(word2)
    for synset1 in synsets1:
        for synset2 in synsets2:
            similarity = synset1.wup_similarity(synset2)
            if similarity is not None and similarity > 0.7:
                return True
    return False

def check_grammar(text):
    tokens = word_tokenize(text)
    tagged_tokens = pos_tag(tokens)
    for token, pos in tagged_tokens:
        if pos.startswith('V') or pos.startswith('JJ') or pos.startswith('RB'):
            if not wordnet.synsets(token):
                return False
    return True

def analyze_sentiment(sentence):
    sid = SentimentIntensityAnalyzer()
    sentiment_score = sid.polarity_scores(sentence)['compound']
    return sentiment_score

def compare_sentiments(teacher_answer, student_answer):
    teacher_sentences = teacher_answer.split('.')
    student_sentences = student_answer.split('.')
    if len(teacher_sentences) != len(student_sentences):
        return 0
    match_count = 0
    for teacher_sent, student_sent in zip(teacher_sentences, student_sentences):
        teacher_sentiment = analyze_sentiment(teacher_sent)
        student_sentiment = analyze_sentiment(student_sent)
        if teacher_sentiment > 0 and student_sentiment > 0:
            match_count += 1
        elif teacher_sentiment < 0 and student_sentiment < 0:
            match_count += 1
    return match_count / len(teacher_sentences)

@app.route('/evaluate', methods=['POST'])
def evaluate():
    try:
        data = request.get_json()
        teacher_answers = data.get('teacher_answers', [])
        student_answers = data.get('student_answers', [])
        weighted_words = data.get('weighted_words', "").split(',')

        if len(teacher_answers) != len(student_answers):
            return jsonify({"error": "Number of teacher and student answers must match"}), 400

        scores = []

        for teacher_answer, student_answer in zip(teacher_answers, student_answers):
            sim, len_sim = calculate_similarity(teacher_answer, student_answer, weighted_words)
            score = (sim + len_sim) / 2 * 100

            for word1, word2 in zip(preprocess_text(teacher_answer), preprocess_text(student_answer)):
                if not check_synonyms(word1, word2):
                    score -= 5

            if not check_grammar(student_answer):
                score -= 10

            sentiment_similarity = compare_sentiments(teacher_answer, student_answer)
            score += sentiment_similarity * 10
            score = abs(score)
            scores.append(round(score, 2))

        total_score = sum(scores) / len(scores)

        return jsonify({
            "question_scores": scores,
            "total_score": round(total_score, 2)
        })

    except Exception as e:
        print("🔥 Server Error:", e)
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

# 🔧 Bind to 0.0.0.0 and use PORT from env for Render
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
