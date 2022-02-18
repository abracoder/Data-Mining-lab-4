import pandas as pd
import time
import sys

# print (sys.argv)
inputFiles=sys.argv
dataCorrect = {'SN':[],'F1':[],'F2':[],'F3':[],'F4':[],'F5':[],'F6':[],'Class':[]}
dataMissing={'inputFileName':[],'Sequence':[],'Class':[]}

def has_numbers(inputString):
    return any(char.isdigit() for char in inputString)

def countSequence(fileName):
    try:
        df = pd.read_csv(fileName)
    except FileNotFoundError:
        print("file not found")
    else:
        if(df.shape[1]==2):
            for index, row in df.iterrows():
                # print(row['Sequence'], row['Class'])
                if (row['Class']=='+' or row['Class']=='-')and (has_numbers(row['Sequence'])==False):
                        dataCorrect['SN'].append(index+1)
                        dataCorrect['F1'].append(row['Sequence'].count("N"))
                        dataCorrect['F2'].append(row['Sequence'].count("H"))
                        dataCorrect['F3'].append(row['Sequence'].count("Q"))
                        dataCorrect['F4'].append(row['Sequence'].count("G"))
                        dataCorrect['F5'].append(row['Sequence'].count("D"))
                        dataCorrect['F6'].append(row['Sequence'].count("T"))
                        if row['Class']=='+':
                            dataCorrect['Class'].append("1")
                        elif row["Class"]=='-':
                            dataCorrect['Class'].append("0")
                else:
                    # if row['Sequence']==None or has_numbers(row['Sequence']):
                    dataMissing['inputFileName'].append(fileName)
                    dataMissing['Sequence'].append(row['Sequence'])
                    dataMissing['Class'].append(row['Class'])

for fileName in inputFiles[1:]:
    countSequence(fileName)
    # pass

# for key,values in dataMissing.items():
#     print(key,len(values))
df2=pd.DataFrame(dataMissing)
df2.to_csv(f'log-{str(time.time())}.csv', encoding='utf-8', index=False)

# print(df2.info)
print("df2")
# for key,values in dataCorrect.items():
#     print(key,len(values))

df1 = pd.DataFrame(dataCorrect)
df1.to_csv(f'result-{str(time.time())}.csv', encoding='utf-8', index=False)


# print(df1)





# print(df['Sequence'])

# x = [x for x in input().split()]
# print(x)

