from flask import Flask, render_template, jsonify
import pandas as pd
import numpy as np
import geopandas as gpd
import folium
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor

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

@app.route('/maps')
def maps():
  return render_template('maps.html')

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

@app.route('/capital/neighborhood_budget')
def neighborhood_budget():
  neighborhood_budget = capital_df.groupby('Neighborhood')['Total_Project_Budget'].sum().sort_values(ascending=False)

  top_n_neighborhoods = 5
  top_neighborhoods = neighborhood_budget.head(top_n_neighborhoods)
  other_neighborhoods = neighborhood_budget.iloc[top_n_neighborhoods:].sum()
  top_neighborhoods['Other'] = other_neighborhoods

  data = top_neighborhoods.reset_index().to_dict(orient='records')
  return jsonify(data)

@app.route('/capital/project_status')
def get_project_status():
  project_status_counts = capital_df['Project_Status'].value_counts()

  data = project_status_counts.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/capital/funding_sources')
def get_funding_sources():
  funding_sources = [
    'Authorization_Existing', 'Authorization_FY', 'Authorization_Future', 
    'Grant_Existing', 'Grant_FY', 'Grant_Future', 'External_Funds'
  ]
  funding_totals = capital_df[funding_sources].sum()

  data = funding_totals.to_dict()
  return jsonify(data)

@app.route('/capital/avg_project_budget')
def get_avg_project_budget():
  average_neighborhood_budget = capital_df.groupby('Neighborhood')['Total_Project_Budget'].mean().sort_values(ascending=False)

  data = average_neighborhood_budget.reset_index().to_dict(orient='records')
  
  return jsonify(data)

@app.route('/capital/yearly_spending')
def get_yearly_spending():
  years = ['Capital_Year_0', 'CapitalYear_1', 'Capital_Year_25']
  capital_yearly_spending = capital_df[years].sum()
  
  data = capital_yearly_spending.reset_index().rename(columns={'index': 'Year', 0: 'Spending'}).to_dict(orient='records')
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
@app.route('/maps/neighborhood_budget')
def get_neighborhood_budget():
  neighborhoods = gpd.read_file('./data/Census2020_BG_Neighborhoods/Census2020_BG_Neighborhoods.shp')
  neighborhoods['BlockGr202']
  set(capital_df['Neighborhood'].unique()) - set(neighborhoods['BlockGr202'])
  capital_df['Neighborhood'] = capital_df['Neighborhood'].replace({
    'Allston/Brighton':'Allston',
    'Downtown/Government Center':'Downtown',
    'Fenway-Kenmore':'Fenway',
    'Bay Village':'South End'
  })
  neighborhood_budget = capital_df.groupby('Neighborhood')['Total_Project_Budget'].sum()
  neighborhood_budget = neighborhood_budget.map('${:,.0f}'.format)
  neighborhoods = neighborhoods.merge(neighborhood_budget, left_on='BlockGr202', right_index=True)
  m = folium.Map(location=[42.3601, -71.0589], zoom_start=12, tiles='cartodbpositron')
  folium.GeoJson(
    neighborhoods,
    tooltip=folium.GeoJsonTooltip(fields=['BlockGr202', 'Total_Project_Budget'],aliases=['Neighborhood','Total Project Budget'], labels=True),
    popup=folium.GeoJsonPopup(fields=['BlockGr202', 'Total_Project_Budget'],aliases=['Neighborhood','Total Project Budget'], labels=True, sticky=False, localize=True, show=True, max_width=250),
  ).add_to(m)
  return m._repr_html_()

@app.route('/maps/per_capita')
def get_per_capita():
  neighborhoods = gpd.read_file('data/Census2020_BG_Neighborhoods/Census2020_BG_Neighborhoods.shp')
  set(capital_df['Neighborhood'].unique()) - set(neighborhoods['BlockGr202'])
  capital_df['Neighborhood'] = capital_df['Neighborhood'].replace({
    'Allston/Brighton':'Allston',
    'Downtown/Government Center':'Downtown',
    'Fenway-Kenmore':'Fenway',
    'Bay Village':'South End'
  })

  income_df = pd.read_csv('data/2015-2019_neighborhood_tables_2021.12.21.csv')
  income_df.columns = ['Location', 'Total population', 'Income', 'Per Capita Income','.','..']
  income_df = income_df[['Location','Total population', 'Income', 'Per Capita Income']].dropna()
  income_df = income_df.iloc[3:].reset_index(drop=True)
  income_df['Total population'] = income_df['Total population'].str.replace(',','').astype(int)
  income_df['Income'] = income_df['Income'].str.replace(',','').str.replace('$','').astype(int)
  income_df['Per Capita Income'] = income_df['Per Capita Income'].str.replace(',','').str.replace('$','').astype(int)
  neighborhood_expenses = capital_df.groupby('Neighborhood')['Total_Project_Budget'].sum()
  neighborhood_expenses = neighborhood_expenses.reset_index()
  neighborhood_expenses.columns = ['Location', 'Total_Project_Budget']
  income_df = income_df.merge(neighborhood_expenses, on='Location', how='left')
  income_df['Total_Project_Budget'] = income_df['Total_Project_Budget'].fillna(0)
  income_df['Per Capita Expenses'] = income_df['Total_Project_Budget'] / income_df['Total population']
  income_df = income_df.replace(0, np.nan)
  dropped = income_df.dropna()
  X = dropped['Per Capita Income'].values.reshape(-1, 1)
  y = dropped['Per Capita Expenses']

  model = LinearRegression()
  model.fit(X, y)

  neighborhoods_merged = neighborhoods.merge(income_df, left_on='BlockGr202', right_on='Location')
  neighborhoods_merged['Predicted Per Capita Expenses'] = model.predict(neighborhoods_merged[['Per Capita Income']])

  m = folium.Map(location=[42.3601, -71.0589], zoom_start=12, tiles='cartodbpositron')
  folium.GeoJson(
    neighborhoods_merged,
    tooltip=folium.GeoJsonTooltip(fields=['Location', 'Per Capita Income', 'Per Capita Expenses'], aliases=['Neighborhood', 'Per Capita Income', 'Per Capita Expenses'], labels=True),
    popup=folium.GeoJsonPopup(fields=['Location', 'Per Capita Income', 'Per Capita Expenses'], aliases=['Neighborhood', 'Per Capita Income', 'Per Capita Expenses'], labels=True, sticky=False, localize=True, show=True, max_width=250),
    style_function=lambda x: {
      'fillColor': 'green' if (x['properties']['Per Capita Expenses'] or 0) > (x['properties']['Predicted Per Capita Expenses'] or 0) else 'red',
      'color': 'black',
      'weight': 2,
      'fillOpacity': 0.5
    }
  ).add_to(m)
  return m._repr_html_()
#------------------------------------------------------------------------------------------------
# Linear Regression Model
@app.route('/model')
def get_model():
  # Load and clean income data
  income_df = pd.read_csv('data/2015-2019_neighborhood_tables_2021.12.21.csv')
  income_df.columns = ['Location', 'Total population', 'Income', 'Per Capita Income', '.', '..']
  income_df = income_df[['Location', 'Total population', 'Income', 'Per Capita Income']].dropna()
  income_df = income_df.iloc[3:].reset_index(drop=True)
  income_df['Total population'] = income_df['Total population'].str.replace(',', '').astype(int)
  income_df['Income'] = income_df['Income'].str.replace(',', '').str.replace('$', '').astype(int)
  income_df['Per Capita Income'] = income_df['Per Capita Income'].str.replace(',', '').str.replace('$', '').astype(int)

  # Merge with neighborhood expenses data
  neighborhood_expenses = capital_df.groupby('Neighborhood')['Total_Project_Budget'].sum()
  neighborhood_expenses = neighborhood_expenses.reset_index()
  neighborhood_expenses.columns = ['Location', 'Total_Project_Budget']
  income_df = income_df.merge(neighborhood_expenses, on='Location', how='left')
  income_df['Total_Project_Budget'] = income_df['Total_Project_Budget'].fillna(0)
  income_df['Per Capita Expenses'] = income_df['Total_Project_Budget'] / income_df['Total population']
  income_df = income_df.replace(0, np.nan)
  dropped = income_df.dropna()

  # Prepare data for linear regression
  X = dropped['Per Capita Income'].values.reshape(-1, 1)
  y = dropped['Per Capita Expenses']

  # Fit the linear regression model
  model = LinearRegression()
  model.fit(X, y)

  # Generate predicted values for the regression line
  predicted_expenses = model.predict(X)

  # Prepare data for return
  graph_data = {
    "scatter": {
      "x": dropped['Per Capita Income'].tolist(),
      "y": dropped['Per Capita Expenses'].tolist(),
      "labels": dropped['Location'].tolist(),
      "sizes": (dropped['Total population'] / 1000).tolist()  # Scale down for visualization
    },
    "regression_line": {
      "x": dropped['Per Capita Income'].tolist(),
      "y": predicted_expenses.tolist()
    },
    "model": {
      "coefficients": model.coef_.tolist(),
      "intercept": model.intercept_
    }
  }

  return jsonify(graph_data)

if __name__ == '__main__':
  app.run(debug=True)
