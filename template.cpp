#include <iostream>
#include <algorithm>
#include <vector>
#include <string>
#include <set>
#include <map>
#include <iterator>
#include <cmath>
using namespace std;
#define SYSTEM_TEST 0

class <%class-name%> {
public:
    <%return-type%> <%method-name%>(<%parameters:$0 $1:, %>) {

    }
};



struct testcase_t {
    <%parameters:$0 $1:;
    %>;
    <%return-type%> expected;
};

string test(const testcase_t&, int);


#if SYSTEM_TEST > 0
#include "<%class-name%>SystemTests.hpp"
#endif

int main()
{
    vector<testcase_t> exampleTests = {
        {<%example-tests:$0:,:, :$0:},
        {%>}
    };
    vector<testcase_t>::iterator it;
    for (it = exampleTests.begin(); it != exampleTests.end(); it++){
        test(*it, 1);
    }

    #if SYSTEM_TEST > 0
    runSystemTests();
    #endif

    return 0;
}


template <typename T>
ostream& operator<< (ostream &os, const vector<T>& v){
    os << "[";
    copy(v.begin(), --v.end(), ostream_iterator<T>(os,", "));
    if(v.begin() != v.end()) os << v.back();
	os << "]";
}

template <typename T1, typename T2>
ostream& operator<< (ostream &os, const pair<T1,T2>& p){
    os << "(" << p.first << ", " << p.second << ")";
}

template <class T> bool equals(T x, T y) { return x == y; }
template <> bool equals(double x, double y) { return fabs(x-y) < 1e-8; }

string test(const testcase_t &testcase, int verbosity){
    <%class-name%> instance;
    <%return-type%> result = instance.<%method-name%>(<%parameters:testcase.$1:, %>);
    string verdict = equals(result,testcase.expected) ? "Accepted" : "WRONG ANSWER!";
    if(verbosity > 0){
        cout << "Testcase: " << <%parameters:testcase.$1: << ' ' << %> << endl;
        cout << "Expected: " << testcase.expected << endl;
        cout << "Received: " << result << endl;
        cout << verdict << endl << endl;
    }
    return verdict;
}
