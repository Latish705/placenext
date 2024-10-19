import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AppliedJobsScreen extends StatefulWidget {
  @override
  _AppliedJobsScreenState createState() => _AppliedJobsScreenState();
}

class _AppliedJobsScreenState extends State<AppliedJobsScreen> {
  List<dynamic> _appliedJobs = [];
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _fetchAppliedJobs();
  }

  Future<void> _fetchAppliedJobs() async {
  try {
    // Replace with the correct URL depending on your environment
    final response = await http.get(Uri.parse('http://10.0.2.2:8080/getJobAppliedByStudent'));

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}'); // Log the response body

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        _appliedJobs = data['appliedJobs'];
        _isLoading = false;
      });
    } else {
      setState(() {
        _errorMessage = 'Failed to load applied jobs';
        _isLoading = false;
      });
    }
  } catch (e) {
    setState(() {
      _errorMessage = 'Error: $e';
      _isLoading = false;
    });
  }
}



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Applied Jobs"),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _errorMessage.isNotEmpty
              ? Center(child: Text(_errorMessage))
              : ListView.builder(
                  itemCount: _appliedJobs.length,
                  itemBuilder: (context, index) {
                    final job = _appliedJobs[index];
                    return ListTile(
                      title: Text(job['app_job_id']['title']), // Assuming your job has a title
                      subtitle: Text(job['app_job_id']['company']), // Assuming your job has a company field
                      trailing: Text(job['status'] ?? 'Unknown'), // Assuming you have a status field
                    );
                  },
                ),
    );
  }
}
