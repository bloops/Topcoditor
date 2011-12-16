
vector<testcase_t> systemTests = {
    {<%system-tests:$0:,:, :$0:},
    {%>}
};

inline void runSystemTests(int verbosity = 0){
    cout << "Running System tests: " << flush;
    bool all_passed = true;
    vector<testcase_t>::iterator it;
    for (it = systemTests.begin(); it != systemTests.end(); it++){
        if(test(*it, verbosity) != "Accepted"){
            all_passed = false;
            cout << "x " << flush;
        }
        else {
            cout << ". " << flush;
        }
    }
    cout << endl << (all_passed ? "Passed System Tests" : "Failed System Tests") << endl;
}
