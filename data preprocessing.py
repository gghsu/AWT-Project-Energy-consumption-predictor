import pandas as pd  # .venv/bin/python -m pip install pandas
import numpy as np 
from sklearn.preprocessing import LabelEncoder  #.venv/bin/python -m pip install scikit-learn
from sklearn.decomposition import PCA
from sklearn.feature_selection import VarianceThreshold


data = pd.read_csv('AWT_export_1.csv')

df = pd.DataFrame(data)

# Initialize LabelEncoder
encoder = LabelEncoder()

# Encode the column jobname, ds_setting_ecomode, streamingSessionID
df['jobName'] = encoder.fit_transform(df['jobName'])
df['ds_setting_ecomode'] = encoder.fit_transform(df['ds_setting_ecomode'])
df['streamingSessionID'] = encoder.fit_transform(df['streamingSessionID'])


# Convert to datetime
df['t'] = pd.to_datetime(df['t'])
df['hour'] = df['t'].dt.hour
df['minute'] = df['t'].dt.minute
df['day_of_week'] = df['t'].dt.dayofweek
df['month'] = df['t'].dt.month
df = df.drop(columns=['t'])  # delete the former t
df['hour'] = df['hour'].astype('int64')
df['minute'] = df['minute'].astype('int64')
df['day_of_week'] = df['day_of_week'].astype('int64')
df['month'] = df['month'].astype('int64')

# Time-series features (rolling mean of power)
df["gs_power_W_rolling_mean"] = df["gs_power_W"].rolling(window=3).mean()
df["gs_power_W_rolling_mean"] = df["gs_power_W_rolling_mean"].fillna(method='bfill') 

# Interaction: voltage * current (mA to A)
df["voltage_current"] = df["gs_voltage_V"] * (df["gs_current_mA"] / 1000)
df["voltage_current_power"] = (df["gs_voltage_V"] * (df["gs_current_mA"] / 1000)) * df["gs_power_factor"]

df["avg_power_per_vendor"] = df.groupby("ds_vendor_model")["gs_power_W"].transform("max")

df['normalized_power'] = df["gs_power_W"] / df["avg_power_per_vendor"] 

df["power_diff"] = df["gs_power_W"] - df["voltage_current_power"]

#  executionId stream one hot encoding
df = pd.get_dummies(df, columns=['executionId', 'stream'], drop_first=True, dtype=int)

# drop columns
df = df.drop(columns=['gs_dsName'])
df = df.drop(columns=['jobName'])
df = df.drop(columns=['streamingSessionID'])

# Analyze summary statistics
print(df.columns)
print(df.columns[df.isna().any()].tolist())

# save dataset
df.to_csv('AWT_studentdata_1.csv', index=False)
