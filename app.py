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

# Capital Budget
capital_df = pd.read_csv('./data/fy25-adopted-capital-budget.csv')
capital_df = capital_df.replace('#Missing', np.nan)
float_columns = [
	'Authorization_Existing', 'Authorization_FY', 'Authorization_Future', 
	'Grant_Existing', 'Grant_FY', 'Grant_Future', 'GO_Expended', 'Capital_Year_0', 
	'CapitalYear_1', 'Capital_Year_25', 'Grant_Expended', 'Grant_Year_0', 
	'Grant_Year_1', 'GrantYear_25', 'External_Funds', 'Total_Project_Budget'
]
capital_df[float_columns] = capital_df[float_columns].astype(float)


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
#------------------------------------------------------------------------------------------------
@app.route('/capital/department_cap_budget')
def get_dept_cap_budget():
  department_spending = capital_df.groupby('Department')['Total_Project_Budget'].sum().sort_values(ascending=False)
  top_n_departments = 5
  top_departments = department_spending.head(top_n_departments)
  other_departments = department_spending.iloc[top_n_departments:].sum()
  top_departments['Other'] = other_departments

  data = top_departments.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/capital/project_status')
def get_project_status():
  project_status_counts = capital_df['Project_Status'].value_counts()

  data = project_status_counts.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/capital/funding_sources')
def get_funding_sources():
  funding_sources = ['Authorization_Existing', 'Authorization_FY', 'Authorization_Future', 
                    'Grant_Existing', 'Grant_FY', 'Grant_Future', 'External_Funds']
  funding_totals = capital_df[funding_sources].sum()

  data = funding_totals.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/capital/top_5_neighborhoods')
def get_top_neighborhoods():
  neighborhood_budget = capital_df.groupby('Neighborhood')['Total_Project_Budget'].sum().sort_values(ascending=False)
  top_n_neighborhoods = 5
  top_neighborhoods = neighborhood_budget.head(top_n_neighborhoods)
  other_neighborhoods = neighborhood_budget.iloc[top_n_neighborhoods:].sum()
  top_neighborhoods['Other'] = other_neighborhoods

  data = top_n_neighborhoods.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/capital/avg_project_budget')
def get_avg_project_budget():
  average_neighborhood_budget = capital_df.groupby('Neighborhood')['Total_Project_Budget'].mean().sort_values(ascending=False)

  data = average_neighborhood_budget.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/capital/capital_spending')
def get_capital_spending():
  years = ['Capital_Year_0', 'CapitalYear_1', 'Capital_Year_25']
  capital_yearly_spending = capital_df[years].sum()

  data = capital_yearly_spending.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/capital/dept_funding_sources')
def get_dept_funding_sources():
  funding_sources = [
    'Authorization_Existing', 'Authorization_FY', 'Authorization_Future',
    'Grant_Existing', 'Grant_FY', 'Grant_Future', 'External_Funds'
  ]
  funding_by_department = capital_df.groupby('Department')[funding_sources].sum()

  data = funding_by_department.reset_index().to_dict(orient='records')
  
  return jsonify(data)

#------------------------------------------------------------------------------------------------


if __name__ == '__main__':
  app.run(debug=True)
