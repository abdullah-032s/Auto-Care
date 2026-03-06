import sys
import csv
import json
import os

def recommend_oil(cc, mileage):
    csv_file = os.path.join(os.path.dirname(__file__), 'oil_data_advanced.csv')
    try:
        with open(csv_file, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if (int(row['min_cc']) <= cc <= int(row['max_cc']) and 
                    int(row['min_mileage']) <= mileage <= int(row['max_mileage'])):
                    
                    
                    brands_list = [b.strip() for b in row['brands'].split(',')]
                    recommended_oil = f"{row['viscosity']} {row['oil_type']}"
                    
                    return {
                        "recommended_oil": [recommended_oil],
                        "brand_names": brands_list
                    }
    except Exception as e:
        return {"error": str(e)}
        
    return {
        "recommended_oil": [],
        "brand_names": []
    }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing engineCC or mileage arguments"}))
        sys.exit(1)
        
    try:
        engine_cc = int(sys.argv[1])
        mileage = int(sys.argv[2])
    except ValueError:
        print(json.dumps({"error": "Arguments must be integers"}))
        sys.exit(1)
        
    result = recommend_oil(engine_cc, mileage)
    print(json.dumps(result))
