import json
import re

def parse_concert_data(file_path):
    concerts = []
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    concert = {}
    details = []
    date_pattern = re.compile(r'^\d{4}\.\d{2}\.\d{2}\.$')  # YYYY.MM.DD. 패턴
    
    for line in lines:
        stripped = line.strip()
        if date_pattern.match(stripped):  # 새로운 공연 데이터의 시작
            if concert:  # 이전 데이터 저장
                concert['details'] = "\n".join(details)
                concerts.append(concert)
                concert = {}
                details = []
            concert['date'] = stripped
        elif 'venue' not in concert:  # 장소 정보 처리
            venue_info = stripped.split(",")
            if len(venue_info) >= 3:
                country = venue_info[0].strip()
                venue = venue_info[-1].strip()
                city = ",".join(venue_info[1:-1]).strip()
                concert['venue'] = {'country': country, 'city': city, 'name': venue}
            else:
                concert['venue'] = {'error': "Invalid venue format", 'raw': stripped}
        elif 'coordinates' not in concert:  # 좌표 처리
            try:
                lat, lon = map(float, stripped.strip("()").split(","))
                concert['coordinates'] = {'latitude': lat, 'longitude': lon}
            except ValueError:
                concert['coordinates'] = {'error': "Invalid coordinates format", 'raw': stripped}
        else:  # 세부 정보 수집
            details.append(stripped)
    
    # 마지막 공연 데이터 추가
    if concert:
        concert['details'] = "\n".join(details)
        concerts.append(concert)
    
    return concerts

def save_as_json(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# 파일 경로 지정
input_file = "ArtistData_Yuja.txt"  # 입력 파일 이름
output_file = "ArtistData_Yuja.json"  # 출력 파일 이름

# 데이터 변환 및 저장
concert_data = parse_concert_data(input_file)
save_as_json(concert_data, output_file)

print(f"데이터가 {output_file}에 저장되었습니다.")
