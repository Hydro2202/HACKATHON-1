from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

JOB_ORDERS = [
    {
        'title': 'Fix Leaky Faucet',
        'assigned_to': 'Technician A',
        'status': 'Pending',
        'status_color': 'text-yellow-600',
        'expected_date': '2025-09-30',
        'completed': False,
        'completion_date': None,
    },
    {
        'title': 'AC Unit Maintenance',
        'assigned_to': 'Technician B',
        'status': 'Completed',
        'status_color': 'text-green-600',
        'expected_date': None,
        'completed': True,
        'completion_date': '2025-09-20',
    },
    {
        'title': 'Elevator Inspection',
        'assigned_to': 'Technician C',
        'status': 'Overdue',
        'status_color': 'text-red-600',
        'expected_date': '2025-09-15',
        'completed': False,
        'completion_date': None,
    }
]

@app.route('/job-orders')
def job_orders():
    return render_template('job_orders.html', job_orders=JOB_ORDERS)

# API endpoint for job orders
@app.route('/api/job-orders')
def api_job_orders():
    return jsonify(JOB_ORDERS)
if __name__ == '__main__':
    app.run(debug=True, port=5000)
