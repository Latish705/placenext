import 'package:app/src/components/Dashboard/student/student_banner.dart';
import 'package:flutter/material.dart';

class OverviewComponent extends StatefulWidget {
  const OverviewComponent({super.key});

  @override
  State<OverviewComponent> createState() => _OverviewComponentState();
}

class _OverviewComponentState extends State<OverviewComponent> {
  @override
  Widget build(BuildContext context) {
    return const SingleChildScrollView(
      child: Column(
        children: [
          BannerWidget(),
        ],
      ),
    );
  }
}
