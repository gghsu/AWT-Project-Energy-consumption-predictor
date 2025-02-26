from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
import pandas as pd
import xgboost as xgb

app = Flask(__name__)
CORS(app)

# Load the pre-trained model
loaded_model = xgb.XGBRegressor(objective='reg:squarederror', tree_method='hist', device="cpu")
loaded_model.load_model('best_xgb_model.model')

scaler = joblib.load('scaler.pkl')
pca = joblib.load('pca.pkl')

@app.route('/')
def index():
    return "Welcome to the ML Prediction API. Use the /predict endpoint with a POST request."


@app.route('/predict', methods=['POST'])
def predict():
    # Expect JSON input 
    data = request.get_json(force=True)

    print("Received input:", data)

    if "ds_display_size" not in data:
        return jsonify({"error": "Missing 'features' in JSON payload"}), 400
    
    try:
        
        # hardcoded record that confirms to model's training data
        # change a few to see effect
        features_dict = {
                    'ds_display_type': int(data['ds_display_type']), 
                    'ds_display_size': int(data['ds_display_size']),
                    'ds_vendor_model': int(data['ds_vendor_model']),
                    'gs_rts': int(data['gs_rts']),
                    'gs_power_W': 47,
                    'gs_voltage_V':230.11, 
                    'gs_current_mA': int(data['gs_current_mA']),
                    'gs_phase_deg': int(data['gs_phase_deg']), 
                    'gs_power_factor': 0.78, 
                    'app_config_greenview':5, 
                    'ds_setting_ecomode':int(data['ds_setting_ecomode']), 
                    
                    'hour':8,
                    'minute':33, 
                    'day_of_week':0, 
                    
                    'month':12,
                    'gs_power_W_rolling_mean':29.0,
                    'voltage_current':37.08796, 
                    'voltage_current_power':94.56600560000001, 
                    'avg_power_per_vendor':104,
                    'normalized_power':0.5918367346938775, 
                    'power_diff':0.10278619999999705,
                    'executionId_0729a212-362f-424f-b746-0bf4ebca08a8':0,
                    'executionId_203aa095-ed1a-4800-aad0-5eb465f8ce5f':1,
                    'executionId_319bdec7-39f0-4e21-8ee8-7bcd09ae62b0':0,
                    'executionId_3934e530-37ae-49f4-a23a-c87d5788a6ed':0,
                    'executionId_4db2a768-b467-4d6b-bd68-5a333d3bd8f1':0,
                    'executionId_9051e59b-28c8-4a52-93cb-aba90650b18c':0,
                    'executionId_98434dca-0da4-419b-8715-3dcb12b4f895':0,
                    'stream_https://refcontent.s3.eu-central-1.amazonaws.com/ref_content/mws/Soccer_GER_NED_RBB_HEVC.mp4':0,
                    'stream_https://refcontent.s3.eu-central-1.amazonaws.com/ref_content/mws/Tatort_RBB_HEVC.mp4':1,
                    'stream_https://refcontent.s3.eu-central-1.amazonaws.com/ref_content/timescapes/timescapes_1920x1080_25_5000.mp4':0

        }
        df_features = pd.DataFrame([features_dict])
        # 2. Apply scaling
        scaled_data = scaler.transform(df_features)
        print(scaled_data.shape)
        # 3. Apply PCA
        pca_data = pca.transform(scaled_data)
        print(pca_data.shape)
                
        # Now use the DataFrame for prediction
        prediction = loaded_model.predict(pca_data)
        return jsonify({"Prediction of power consumption (wh) ": int(prediction[0] )})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Listen on all interfaces; port 5000 will be exposed in Docker.
    app.run(host='0.0.0.0', port=5000)
