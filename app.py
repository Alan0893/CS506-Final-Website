from flask import Flask, render_template, jsonify
import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

# Operating Budget
operating_df = pd.read_csv('./data/fy25-adopted-operating-budget.csv')
operating_df = operating_df.replace('#Missing', np.nan)
operating_df['FY22 Actual Expense'] = operating_df['FY22 Actual Expense'].astype(float)
operating_df['FY23 Actual Expense'] = operating_df['FY23 Actual Expense'].astype(float)
operating_df['FY24 Appropriation'] = operating_df['FY24 Appropriation'].astype(float)
operating_df['FY25 Budget'] = operating_df['FY25 Budget'].astype(float)

app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/operating')
def operating():
  return render_template('operating.html')

@app.route('/capital')
def capital():
  return render_template('capital.html')

#------------------------------------------------------------------------------------------------
@app.route('/operating/top_5_dept')
def get_operating_budget():
  dept_spending = operating_df.groupby('Dept')[['FY22 Actual Expense', 'FY23 Actual Expense', 'FY24 Appropriation', 'FY25 Budget']].sum()
  dept_spending = dept_spending.sort_values('FY25 Budget', ascending=False)
  n = 5
  top_n = dept_spending.head(n)
  other = dept_spending.iloc[n:].sum()
  top_n.loc['Other'] = other

  data = top_n.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/operating/budget_by_category')
def get_budget_by_category():
  category_spending = operating_df.groupby('Expense Category')['FY25 Budget'].sum()
  category_spending = category_spending.sort_values(ascending=False)

  data = category_spending.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/operating/program_budget')
def get_program_budget():
  n = 15
  program_spending = operating_df.groupby('Program')['FY25 Budget'].sum()
  program_spending = program_spending.sort_values(ascending=False)
  top_n_program = program_spending.head(n)
  other = program_spending.iloc[n:].sum()
  top_n_program.loc['Other'] = other

  data = top_n_program.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/operating/top_5_dept')
def get_top_5_dept():
  n = 5

  dept_spending = operating_df.groupby('Dept')[['FY22 Actual Expense', 'FY23 Actual Expense', 'FY24 Appropriation', 'FY25 Budget']].sum()
  dept_spending_sorted = dept_spending.sort_values('FY25 Budget', ascending=False)
  top_n = dept_spending_sorted.head(n)

  response_data = top_n.reset_index().to_dict(orient='records')

  return jsonify(response_data)

@app.route('/operating/top_5_increased')
def get_top_5_increased():
  n = 5 

  dept_spending = operating_df.groupby('Dept')[['FY22 Actual Expense', 'FY23 Actual Expense', 'FY24 Appropriation', 'FY25 Budget']].sum()
  dept_spending['Increase'] = dept_spending['FY25 Budget'] - dept_spending['FY22 Actual Expense']
  dept_spending_sorted = dept_spending.sort_values('Increase', ascending=False)
  top_n = dept_spending_sorted.head(n)

  response_data = {
    "departments": [],
    "years": ["FY22", "FY23", "FY24", "FY25"]
  }

  for dept, row in top_n.iterrows():
    response_data["departments"].append({
      "department": dept,
      "expenses": {
        "FY22": row['FY22 Actual Expense'],
        "FY23": row['FY23 Actual Expense'],
        "FY24": row['FY24 Appropriation'],
        "FY25": row['FY25 Budget']
      }
   })

  return jsonify(response_data)

@app.route('/operating/category_expenses', methods=['GET'])
def category_expenses():
  category_spending = operating_df.groupby('Expense Category')[['FY22 Actual Expense', 'FY23 Actual Expense', 'FY24 Appropriation', 'FY25 Budget']].sum()

  response_data = {
      "categories": [],
      "years": ["FY22", "FY23", "FY24", "FY25"]
  }

  for category, row in category_spending.iterrows():
    response_data["categories"].append({
      "category": category,
      "expenses": {
        "FY22": row['FY22 Actual Expense'],
        "FY23": row['FY23 Actual Expense'],
        "FY24": row['FY24 Appropriation'],
        "FY25": row['FY25 Budget']
      }
    })

  return jsonify(response_data)


if __name__ == '__main__':
  app.run(debug=True)
