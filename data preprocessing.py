import pandas as pd  # .venv/bin/python -m pip install pandas
import numpy as np 
from sklearn.preprocessing import LabelEncoder  #.venv/bin/python -m pip install scikit-learn
from sklearn.decomposition import PCA
from sklearn.feature_selection import VarianceThreshold


data = pd.read_csv('AWT_export_1.csv')
#print(data.head())
#print(data.info())

df = pd.DataFrame(data)

#unique_strings = data['stream'].loc[data['stream'].apply(lambda x: isinstance(x, str))].unique()

#print("Unique strings in the column:", unique_strings)

# Define the mapping
#mapping = {'https://refcontent.s3.eu-central-1.amazonaws.com/ref_content/timescapes/timescapes_1920x1080_25_5000.mp4': 1, 
#           'https://refcontent.s3.eu-central-1.amazonaws.com/ref_content/mws/Soccer_GER_NED_RBB_HEVC.mp4': 2,
#           'https://refcontent.s3.eu-central-1.amazonaws.com/ref_content/mws/Sandmann_RBB_HEVC.mp4': 3,
#           'https://refcontent.s3.eu-central-1.amazonaws.com/ref_content/mws/Tatort_RBB_HEVC.mp4':4}

# Apply the mapping
#data['stream_vid_typ'] = data['stream'].map(mapping)

#data.to_csv('your_file_updated.csv', index=False)



# Initialize LabelEncoder
encoder = LabelEncoder()

# Fit and transform the column jobname
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
ds_setting_ecomode
df["voltage_current_power"] = (df["gs_voltage_V"] * (df["gs_current_mA"] / 1000)) * df["gs_power_factor"]


#df["time_elapsed"] = (df["t"] - df["t"].iloc[0]).dt.total_seconds()

df["avg_power_per_vendor"] = df.groupby("ds_vendor_model")["gs_power_W"].transform("max")


df['normalized_power'] = df["gs_power_W"] / df["avg_power_per_vendor"] 


df["power_diff"] = df["gs_power_W"] - df["voltage_current_power"]


# drop columns

#  executionId stream one hot encoding
df = pd.get_dummies(df, columns=['executionId', 'stream'], drop_first=True, dtype=int)


#df = df.drop(columns=['stream'])
#df = df.drop(columns=['executionId'])
df = df.drop(columns=['gs_dsName'])
#df = df.drop(columns=['month'])
df = df.drop(columns=['jobName'])
df = df.drop(columns=['streamingSessionID'])



#selector = VarianceThreshold(threshold=0.1)
#reduced_data = selector.fit_transform(df)



# Analyze summary statistics
print(df.columns)

# Plot the distribution
#import matplotlib.pyplot as plt
#plt.hist(df["power_diff"], bins=20)
#plt.xlabel("Power Difference (W)")
#plt.ylabel("Frequency")
#plt.title("Discrepancy Between Measured and Calculated Power")
#plt.show()

# Check correlation with other variables
#print(df[["power_diff", "gs_current_mA", "gs_voltage_V"]].corr())
print(df.columns[df.isna().any()].tolist())
df.to_csv('AWT_studentdata_1.csv', index=False)
