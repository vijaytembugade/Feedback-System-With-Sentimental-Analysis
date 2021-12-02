from flask import Flask, jsonify, request, send_file
import pandas as pd
from textblob import TextBlob
import numpy as np
import json
from nltk.corpus import wordnet
import string
from nltk import pos_tag
# from nltk.corpus import stopwords
from nltk.tokenize import WhitespaceTokenizer
from nltk.stem import WordNetLemmatizer
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from io import BytesIO
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as fingureCanvas
# import re
# import pymongo
# import nltk
# import bs4 as bs
import urllib.request
import re
import base64
# import heapq
import gensim
from gensim.summarization.summarizer import summarize
app = Flask(__name__)

# myclient = pymongo.MongoClient("mongodb://localhost:27017/")
# mydb = myclient["feedback"]


@app.route('/testing', methods=['POST','GET'])
def index():
    return '<h1>Hello world<h1>'


@app.route('/section-wise', methods=['POST'])
def calculate():
    data = request.get_json()
    print(data)
    # for loops for data arrangment from json to dataframe
    f_forms = []
    for e in data["all_forms"]:
        f_forms.append(e["feedback"])
#    columns = []
#    for e in data['questions']:
#        columns = columns + e

    # creating data Frame
    df = pd.DataFrame(f_forms)

    # separating comment sections
    answers = df.drop([5, 9, 12, 17, 23], axis=1)
    subject_command = answers[[0, 1, 2, 3, 4]]
    puctuality = answers[[6, 7, 8]]
    teching_method = answers[[10, 13, 11]]
    doubt_solving = answers[[14, 15, 16, 18]]
    behaviour_dis = answers[[19, 20, 21, 22]]
    sections = [subject_command, puctuality, teching_method, doubt_solving, behaviour_dis]

    # Columns Names
    column_names = ['Subject Depth', 'Preparation for class', 'Interest Stimulation in Students',
                       'Topic Coverage Beyond Syllabus', 'Providing Study Material', 'Syllabus Completed %',
                       'Time Utiliszation', 'Extra Efforst in Free time', 'Teaching Methodology Used',
                       'Practicals with Demonstrations', 'Subject Understanding By Students %', 'Communication Gap',
                       "Teacher's Activeness and Alertness", 'Encourage 2-way communication with Students',
                       'Teacher Accessible outside the class', 'Prevents Cheating in Class',
                       'Do not have Discriminating Behaviour', 'Helpful and Motivates Student', 'Discipline in class', ]
    answers.columns = column_names

    # Separating and segration of data
    x = [[{}, {}], [{}, {}], [{}, {}], [{}, {}], [{}, {}]]
    section_no = 0

    def find_best(df1, pos):
        for i in df1.columns:
            print(i)
            # if type(df1[i].value_counts().idxmax()) == str:
            #     y={str(df1[i].value_counts().idxmax()): df1[i].value_counts().max()}
            # else:
            y={df1[i].value_counts().idxmax(): df1[i].value_counts().max()}
            #         find best
            if len(list(x[pos][0])) != 0:
                a = list(x[pos])[0][list(list(x[pos])[0])[0]]  # {5:76}
                old_point = list(a)[0]
                old_score = a[list(a)[0]]

                new_point = list(y)[0]
                new_score = y[list(y)[0]]

                if old_score < new_score:
                    x[pos][0] = {i: y}
            else:
                x[pos][0] = {i: y}

            #         find worst
            if len(list(x[pos][1])) != 0:

                a = list(x[pos])[1][list(list(x[pos])[1])[0]]  # {5:76}
                old_point = list(a)[0]
                old_score = a[list(a)[0]]

                new_point = list(y)[0]
                new_score = y[list(y)[0]]

                if old_score > new_score:
                    x[pos][1] = {i: y}
            else:
                x[pos][1] = {i: y}

    index = 0
    for section in sections:
        find_best(section, index)
        index = index + 1

    analysis= []
    z = 0
    sections_names = ["subject_command", "punctuality", "teaching_methodology", "doubt_solving" , "behavior_and_discipline" ]
    column_names1 = ['Subject Depth', 'Preparation for class', 'Interest Stimulation in Students',
                       'Topic Coverage Beyond Syllabus', 'Providing Study Material','subject_command_comment', 'Syllabus Completed %',
                       'Time Utiliszation', 'Extra Efforst in Free time', 'punctuality_comment', 'Teaching Methodology Used',
                       'Practicals with Demonstrations', 'Subject Understanding By Students %', 'teaching_methodology_comment', 'Communication Gap',
                       "Teacher's Activeness and Alertness", 'Encourage 2-way communication with Students',
                       'Teacher Accessible outside the class', 'doubt_solving_comment', 'Prevents Cheating in Class',
                       'Do not have Discriminating Behaviour', 'Helpful and Motivates Student', 'Discipline in class', 'behavior_and_discipline_comment', ]
    for sec in x:
        temp = {}
        print(sec, list(sec[0].keys())[0] , list(sec[1].keys())[0])
        temp['section_name'] = sections_names[z]
        temp['best'] =  column_names1[list(sec[0].keys())[0]]
        temp['worst'] =  column_names1[list(sec[1].keys())[0]]
        analysis.append(temp)
        z=z+1
    # find_best(subject_command, 0)
    # find_best(puctuality, 1)
    # find_best(teching_method, 2)
    # find_best(doubt_solving, 3)
    # find_best(behaviour_dis, 4)
    # print(str(x))
    # d = {"section_wise": x}
    # d= x
    print(analysis)
    
    return jsonify(analysis)

@app.route('/psycho', methods = ['POST'])
def psycho():
    data = request.get_json()
    # print(data)
    valid_id = []

    def maping(set1, set2, num):
        countTrue = 0
        countFalse = 0
        for i,j in zip(set1, set2):
            if i == j or i == j-1 or i == j+1:
                # print(True)
                countTrue += 1
            else:
                # print(False)
                countFalse +=1
        return { "truth": countTrue, "non_truth": countFalse, "student_id": num}

    def TrustSelection(num):
        if num[0] >= 5:
            return num[2]
        else :
            pass

    def checkFrequency(set1, set2, num):
        
        frequencyCoutArray = []
        result = False
        for i in set1:
            frequencyCoutArray.append(i)
        if len(frequencyCoutArray) > 0 :
            result = all(elem == frequencyCoutArray[0] for elem in frequencyCoutArray)
        if result:
            return { "truth": -1, "non_truth": -1, "student_id": num}
        else:
            trustFactor = maping(set1, set2, num)
            # print(trustFactor)
        return trustFactor


    trustedId = []

    for i in data:
        # print(i["response"][:13])
        trustFactor = checkFrequency(i["response"][:13], i["response"][13:25], i["student_id"])
        
#        valid_id.append(TrustSelection(trustFactor))
        trustedId.append(trustFactor)

    print(trustedId)
    return jsonify({"trusted_id" : trustedId})


@app.route('/summary', methods = ['POST'])
def summary():
    data = request.get_json()
    f_forms = []
    for e in data["all_forms"]:
        f_forms.append(e["feedback"])
    # columns = []
    # for e in data['questions']:
    #     columns = columns + e
    #creating dataframe for comments
    df = pd.DataFrame(f_forms)
    x = df[df.columns[5]].append(df[df.columns[9]]).append(df[df.columns[12]]).append(df[df.columns[17]]).append(
        df[df.columns[23]])
    # 5,9,13,18,23
    comments = []
    for i in x:
        comments.append(i)
   
    
    data_comments = comments
    data_comments = "\n".join(data_comments)
    
    summarized_content = summarize(data_comments, ratio = 0.025)
    print(summarized_content)
    return jsonify({"summary" : summarized_content})

@app.route('/suggestions', methods=['POST'])
def comments():
    # f = open("data.json", encoding="utf-8")
    # data = json.load(f)  # read temporary data
    # mycol = mydb["comments"]
    #adjustments of data
    data = request.get_json()
    f_forms = []
    for e in data["all_forms"]:
        f_forms.append(e["feedback"])
    # columns = []
    # for e in data['questions']:
    #     columns = columns + e
    #creating dataframe for comments
    df = pd.DataFrame(f_forms)
    x = df[df.columns[5]].append(df[df.columns[9]]).append(df[df.columns[12]]).append(df[df.columns[17]]).append(
        df[df.columns[23]])
    # 5,9,13,18,23
    comments = []
    for i in x:
        comments.append(i)
    #sentiment using textblob
    polarity = []
    subjectivity = []
    def tt(data):
        text = str(data)
        blob = TextBlob(text)
        polarity.append(blob.sentiment.polarity)  # -1 to 1
        subjectivity.append(blob.sentiment.subjectivity)
    for i in comments:
        tt(i)
    sentiments = {'comments': comments, 'polarity': polarity, 'subjectivity': subjectivity}
    sentiments = pd.DataFrame.from_dict(sentiments)
    #NLTK module part
    def get_wordnet_pos(pos_tag):
        if pos_tag.startswith('J'):
            return wordnet.ADJ
        elif pos_tag.startswith('V'):
            return wordnet.VERB
        elif pos_tag.startswith('N'):
            return wordnet.NOUN
        elif pos_tag.startswith('R'):
            return wordnet.ADV
        else:
            return wordnet.NOUN
    def clean_text(text):
        # lower text
        text = text.lower()
        # tokenize text and remove puncutation
        text = [word.strip(string.punctuation) for word in text.split(" ")]
        # remove words that contain numbers
        text = [word for word in text if not any(c.isdigit() for c in word)]
        # remove stop words
        stop = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
                'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]
        text = [x for x in text if x not in stop]
        # remove empty tokens
        text = [t for t in text if len(t) > 0]
        # pos tag text
        pos_tags = pos_tag(text)
        # lemmatize text
        text = [WordNetLemmatizer().lemmatize(t[0], get_wordnet_pos(t[1])) for t in pos_tags]
        # remove words with only one letter
        text = [t for t in text if len(t) > 1]
        # join all
        text = " ".join(text)
        return (text)
    sentiments["comment_clean"] = sentiments["comments"].apply(lambda x: clean_text(str(x)))
    #sentiment using NLTK
    sid = SentimentIntensityAnalyzer()
    sentiments["ox_senti"] = sentiments["comment_clean"].apply(lambda x: sid.polarity_scores(str(x)))
    sentiments = pd.concat([sentiments.drop(['ox_senti'], axis=1), sentiments['ox_senti'].apply(pd.Series)], axis=1)
    #suggestion classification
    def prog_sent(text):
        patterns = ['should', 'might', 'may', 'would', 'can', 'could', 'must', 'need', 'should have', 'have more',
                    'suggestion', 'perhaps', 'could be', 'can be', 'could have', 'could give', 'could provide',
                    'could explore', 'better if', 'think', 'suggest']
        output = []
        flag = 0
        for pat in patterns:
            if re.search(pat, text) != None:
                flag = 1
                break
        return flag
    sug_list = []
    for i in comments:
        temp = prog_sent(str(i))
        sug_list.append(temp)
    sentiments['suggestion_list'] = sug_list
    suggestions = sentiments.loc[sentiments['suggestion_list'] == 1]
    sug = suggestions.comments.to_json()

    print(sug)
    # short_summary = summary(data_comments)
    
    return sug

@app.route('/create-section1', methods=['POST'])
def image_reaction1():
    data = request.get_json()
    f_forms = []
    for e in data["all_forms"]:
           f_forms.append(e["feedback"])
    columns = []
    df = pd.DataFrame(f_forms)
    answers = df.drop([5, 9, 12, 17, 23], axis=1)
    subject_command = answers[[0, 1, 2, 3, 4]]
    puctuality = answers[[6, 7, 8]]
    teching_method = answers[[10, 13, 11]]
    doubt_solving = answers[[14, 15, 16, 18]]
    behaviour_dis = answers[[19, 20, 21, 22]]
    sections = [subject_command, puctuality,
        teching_method, doubt_solving, behaviour_dis]
    answers.columns = ['Subject Depth', 
                       'Preparation for class', 
                       'Interest Stimulation in Students',
                       'Topic Coverage Beyond Syllabus', 
                       'Providing Study Material', 
                       'Syllabus Completed %',
                       'Time Utiliszation',
                       'Extra Efforst in Free time', 
                       'Teaching Methodology Used',
                       'Practicals with Demonstrations', 
                       'Subject Understanding By Students ', 
                       'Communication Gap',
                       "Teacher's Activeness and Alertness", 
                       'Encourage 2-way communication with Students',
                       'Teacher Accessible outside the class', 
                       'Prevents Cheating in Class',
                       'Do not have Discriminating Behaviour', 
                       'Helpful and Motivates Student', 
                       'Discipline in class', ]
    sections = [subject_command, puctuality,
        teching_method, doubt_solving, behaviour_dis]
    temp = []
    for col in answers.columns:
        temp.append((answers[col].value_counts()))
    temp = pd.DataFrame(temp).fillna(0).T
    temp = temp.iloc[:5]
    section1 = temp[['Subject Depth', 'Preparation for class', 'Interest Stimulation in Students',
        'Topic Coverage Beyond Syllabus', 'Providing Study Material', ]]
    categorical_1 = ['Subject Depth', 'Preparation for class', 'Interest Stimulation\n in Students',
        'Topic Coverage Beyond\n Syllabus', 'Providing Study\n Material']
    colors = ['gray', 'blue', 'orange', 'green', 'red']
    typer = ['Strongly Disagree', 'Disagree',
        'Neutral', 'Agree', 'Strongly Agree']
    numerical = section1.to_numpy()
    number_groups = len(categorical_1)
    bin_width = 1.0/(number_groups+2)
    fig, ax = plt.subplots(figsize=(18, 8))
    for i in range(len(typer)):
        ax.bar(x=np.arange(len(categorical_1)) + i*bin_width,
            height=numerical[i],
            width=bin_width,
            color=colors[i],
            align='center')
    ax.set_xticks(np.arange(len(categorical_1)) +
                  number_groups/(2*(number_groups+1)))
    # number_groups/(2*(number_groups+1)): offset of xticklabel
    ax.set_xticklabels(categorical_1)
    ax.legend(typer, facecolor='w')
    plt.title('Section1 : Subject Command',  fontweight='bold')
    plt.xlabel('Question Points', fontweight='bold')
    plt.ylabel('Score',  fontweight='bold')
    # plt.show()
    canvas = fingureCanvas(fig)
    encoded_img = get_encoded_img(fig)
    # img = BytesIO()
    # img.seek(0)
    # fig.savefig(img, dpi=75)
    return jsonify({'image': encoded_img})

def get_encoded_img(fig):
    img= fig
    img_byte_arr = BytesIO()
    img.savefig(img_byte_arr, format='PNG')
    my_encoded_img = base64.encodebytes(img_byte_arr.getvalue()).decode('ascii')
    return my_encoded_img

@app.route('/create-section4', methods=['POST'])
def image_reaction2():
    data = request.get_json()
    f_forms = []
    for e in data["all_forms"]:
          f_forms.append(e["feedback"])
    columns = []
    df = pd.DataFrame(f_forms)
    answers = df.drop([5, 9, 12, 17, 23], axis=1)
    subject_command = answers[[0, 1, 2, 3, 4]]
    puctuality = answers[[6, 7, 8]]
    teching_method = answers[[10, 11, 13]]
    doubt_solving = answers[[14, 15, 16, 18]]
    behaviour_dis = answers[[19, 20, 21, 22]]
    sections = [subject_command, puctuality,
        teching_method, doubt_solving, behaviour_dis]
    answers.columns = ['Subject Depth', 'Preparation for class', 'Interest Stimulation in Students',
                       'Topic Coverage Beyond Syllabus', 'Providing Study Material', 'Syllabus Completed %',
                       'Time Utiliszation', 'Extra Efforst in Free time', 'Teaching Methodology Used',
                       'Practicals with Demonstrations', 'Subject Understanding By Students ', 'Communication Gap',
                       "Teacher's Activeness and Alertness", 'Encourage 2-way communication with Students',
                       'Teacher Accessible outside the class', 'Prevents Cheating in Class',
                       'Do not have Discriminating Behaviour', 'Helpful and Motivates Student', 'Discipline in class', ]
    sections = [subject_command, puctuality,
        teching_method, doubt_solving, behaviour_dis]
    temp = []
    for col in answers.columns:
        temp.append((answers[col].value_counts()))
    temp = pd.DataFrame(temp).fillna(0).T
    temp = temp.iloc[:5]
    categorical_1 = ['Communication Gap', "Teacher's\n Activeness and Alertness",
        'Encourage 2-way communication\n with Students', 'Teacher Accessible\n outside the class']
    colors = ['gray', 'blue', 'orange', 'green', 'red']
    typer = ['Strongly Disagree', 'Disagree',
        'Neutral', 'Agree', 'Strongly Agree']
    numerical = section4.to_numpy()
    number_groups = len(categorical_1)
    bin_width = 1.0/(number_groups+2)
    fig, ax = plt.subplots(figsize=(15, 8))
    for i in range(len(typer)):
        ax.bar(x=np.arange(len(categorical_1)) + i*bin_width,
               height=numerical[i],
               width=bin_width,
               color=colors[i],
               align='center')
    ax.set_xticks(np.arange(len(categorical_1)) +
                  number_groups/(2*(number_groups+1)))
    # number_groups/(2*(number_groups+1)): offset of xticklabel
    ax.set_xticklabels(categorical_1)
    ax.legend(typer, facecolor='w')
    plt.title('Section1 : Subject Command',  fontweight='bold')
    plt.xlabel('Question Points', fontweight='bold',  wrap=True)
    plt.ylabel('Score',  fontweight='bold')
    # plt.show()
    # fig.savefig('section1.png', dpi=75)
    canvas = fingureCanvas(fig)
    img = BytesIO()
    img.seek(0)
    return send_file(img, mimetype="image/png")

@app.route('/create-section5', methods=['POST'])
def image_reaction3():
    data = request.get_json()
    f_forms = []
    for e in data["all_forms"]:
        f_forms.append(e["feedback"])
    columns = []
    df = pd.DataFrame(f_forms)
    answers = df.drop([5, 9, 12, 17, 23], axis=1)
    subject_command = answers[[0, 1, 2, 3, 4]]
    puctuality = answers[[6, 7, 8]]
    teching_method = answers[[10, 11, 13]]
    doubt_solving = answers[[14, 15, 16, 18]]
    behaviour_dis = answers[[19, 20, 21, 22]]
    sections = [subject_command, puctuality, teching_method, doubt_solving, behaviour_dis]
    answers.columns = ['Subject Depth', 'Preparation for class', 'Interest Stimulation in Students',
                       'Topic Coverage Beyond Syllabus', 'Providing Study Material', 'Syllabus Completed %',
                       'Time Utiliszation', 'Extra Efforst in Free time', 'Teaching Methodology Used',
                       'Practicals with Demonstrations', 'Subject Understanding By Students ', 'Communication Gap',
                       "Teacher's Activeness and Alertness", 'Encourage 2-way communication with Students',
                       'Teacher Accessible outside the class', 'Prevents Cheating in Class',
                       'Do not have Discriminating Behaviour', 'Helpful and Motivates Student', 'Discipline in class', ]
    sections = [subject_command, puctuality, teching_method, doubt_solving, behaviour_dis]
    temp = []
    for col in answers.columns:
        temp.append((answers[col].value_counts()))
        
    temp = pd.DataFrame(temp).fillna(0).T
    temp = temp.iloc[:5]
    categorical_1 = ['Communication Gap',"Teacher's Activeness\n and Alertness",'Encourage 2-way communication\n with Students','Teacher Accessible outside the class' ]
    colors        = ['gray', 'blue', 'orange', 'green', 'red']
    typer = ['Strongly Disagree', 'Disagree','Neutral', 'Agree','Strongly Agree']
    numerical = section5.to_numpy()
    number_groups = len(categorical_1) 
    bin_width = 1.0/(number_groups+2)
    fig, ax = plt.subplots(figsize=(18,8))
    for i in range(len(typer)):
        ax.bar(x=np.arange(len(categorical_1)) + i*bin_width, 
               height=numerical[i],
               width=bin_width,
               color=colors[i],
               align='center')
    ax.set_xticks(np.arange(len(categorical_1)) + number_groups/(2*(number_groups+1)))
    # number_groups/(2*(number_groups+1)): offset of xticklabel
    ax.set_xticklabels(categorical_1)
    ax.legend(typer, facecolor='w')
    plt.title('Section1 : Subject Command',  fontweight='bold')
    plt.xlabel('Question Points' , fontweight='bold',  wrap=True)
    plt.ylabel('Score',  fontweight='bold')
    
    canvas = fingureCanvas(fig)
    img = BytesIO()
    img.seek(0)
    return send_file(img, mimetype="image/png")

@app.route('/create-syllabus-completion', methods=['POST'])
def image_reaction4():
    data = request.get_json()
    f_forms = []
    for e in data["all_forms"]:
        f_forms.append(e["feedback"])
    columns = []
    df = pd.DataFrame(f_forms)
    answers = df.drop([5, 9, 12, 17, 23], axis=1)
    subject_command = answers[[0, 1, 2, 3, 4]]
    puctuality = answers[[6, 7, 8]]
    teching_method = answers[[10, 11, 13]]
    doubt_solving = answers[[14, 15, 16, 18]]
    behaviour_dis = answers[[19, 20, 21, 22]]
    sections = [subject_command, puctuality,
                teching_method, doubt_solving, behaviour_dis]
    answers.columns = ['Subject Depth', 'Preparation for class', 'Interest Stimulation in Students',
                       'Topic Coverage Beyond Syllabus', 'Providing Study Material', 'Syllabus Completed %',
                       'Time Utiliszation', 'Extra Efforst in Free time', 'Teaching Methodology Used',
                       'Practicals with Demonstrations', 'Subject Understanding By Students ', 'Communication Gap',
                       "Teacher's Activeness and Alertness", 'Encourage 2-way communication with Students',
                       'Teacher Accessible outside the class', 'Prevents Cheating in Class',
                       'Do not have Discriminating Behaviour', 'Helpful and Motivates Student', 'Discipline in class', ]
    sections = [subject_command, puctuality,
                teching_method, doubt_solving, behaviour_dis]
    temp = []
    for col in answers.columns:
        temp.append((answers[col].value_counts()))
    temp = pd.DataFrame(temp).fillna(0).T
    temp = temp.iloc[:5]
    
    syllabus = temp['Syllabus Completed %']
    mylabels = ['less than 40%', '40-50 %', '50-75%', '75-90 %', 'above 90%']
    fig = plt.figure()
    plt.pie(syllabus.to_numpy(), labels=mylabels, shadow=True, radius=1.4)
    # plt.show()
    canvas = fingureCanvas(fig)
    img = BytesIO()
    img.seek(0)
    
    return send_file(img, mimetype="image/png")

@app.route('/create-understand-subject', methods=['POST'])
def image_reaction5():
    data = request.get_json()
    f_forms = []
    for e in data["all_forms"]:
        f_forms.append(e["feedback"])
    columns = []
    df = pd.DataFrame(f_forms)
    answers = df.drop([5, 9, 12, 17, 23], axis=1)
    subject_command = answers[[0, 1, 2, 3, 4]]
    puctuality = answers[[6, 7, 8]]
    teching_method = answers[[10, 11, 13]]
    doubt_solving = answers[[14, 15, 16, 18]]
    behaviour_dis = answers[[19, 20, 21, 22]]
    sections = [subject_command, puctuality,
                teching_method, doubt_solving, behaviour_dis]
    answers.columns = ['Subject Depth', 'Preparation for class', 'Interest Stimulation in Students',
                       'Topic Coverage Beyond Syllabus', 'Providing Study Material', 'Syllabus Completed %',
                       'Time Utiliszation', 'Extra Efforst in Free time', 'Teaching Methodology Used',
                       'Practicals with Demonstrations', 'Subject Understanding By Students ', 'Communication Gap',
                       "Teacher's Activeness and Alertness", 'Encourage 2-way communication with Students',
                       'Teacher Accessible outside the class', 'Prevents Cheating in Class',
                       'Do not have Discriminating Behaviour', 'Helpful and Motivates Student', 'Discipline in class', ]
    sections = [subject_command, puctuality,
                teching_method, doubt_solving, behaviour_dis]
    temp = []
    for col in answers.columns:
        temp.append((answers[col].value_counts()))
    temp = pd.DataFrame(temp).fillna(0).T
    temp = temp.iloc[:5]
    under_sub = temp['Subject Understanding By Students ']
    mylabels = ['less than 40%', '40-50 %', '50-75%', '75-90 %', 'above 90%']
    fig = plt.figure()
    plt.pie(under_sub.to_numpy(), labels=mylabels, shadow=True, radius=1.4)
    # plt.show()
    canvas = fingureCanvas(fig)
    img = BytesIO()
    img.seek(0)
    return send_file(img, mimetype="image/png")


if __name__ == '__main__':
    app.run(debug=True)
