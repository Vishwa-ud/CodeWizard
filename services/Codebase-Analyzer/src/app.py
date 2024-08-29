from flask import Flask

app = Flask(__name__)
app.url_map.strict_slashes = False

@app.route('/calculate')
def hello_world():
    return 'Hello from Service 1!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)