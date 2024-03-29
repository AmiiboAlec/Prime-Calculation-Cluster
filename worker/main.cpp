#include <iostream>
#include <string>
#include "cpp-httplib/httplib.h"
#include <thread>
#include <vector>
#include <sstream>
#include <exception>
#include <atomic>
#include <signal.h>
#include <chrono>

#define PORT 9003

using std::string;
using httplib::Client;
std::vector<short> numslist;
int base;
std::atomic<int> thread_counter;
bool kill_flag;

void init(const string& host) {
    using std::stringstream;
    stringstream reader;
    {
        Client cli(host);
        auto res = cli.Get("/initializer");
        if (res->status != 200) throw std::runtime_error("INVALID RESPONSE");
        reader = stringstream(res->body);
    }
    string line;
    std::getline(reader, line);
    base = atoi(line.c_str());
    for (line = ""; std::getline(reader, line);) {
        numslist.push_back(std::atoi(line.c_str()));
    }
    numslist.push_back(0);
    numslist.shrink_to_fit();
}

string get_job(const string& host) {
    Client cli(host);
    auto res = cli.Get("/newjob");
    if (res->status != 200) throw std::runtime_error("INVALID RESPONSE");
    return res->body;
}

void submit_job(const string& host, std::vector<int> results, int job_num) {
    thread_counter++;
    string nums_string;
    {
        std::ostringstream out_buff;
        for (const auto &a : results) out_buff << a << "\n";
        nums_string = out_buff.str();
    }
    httplib::Params params;
    params.emplace("primes", std::move(nums_string));
    params.emplace("job_num", std::to_string(job_num));
    thread_counter--;
}

void perform_job(const string& host) {
restart:
    using std::thread;
    auto job = get_job(host);
    int job_num = atoi(job.c_str()); //May need to change this later
    std::vector<int> output = std::vector<int>(1000000);
    
    //calculate...

    thread submit = thread(submit_job, host, std::move(output), job_num);
    submit.detach();
    if (!kill_flag) goto restart;
    thread_counter--;
    return;
}

void sighandler(int signum) {
    kill_flag = true;
}

int main (int argc, char** argv) {
    using std::thread;
    using namespace std::chrono_literals;
    if (argc < 3) {
        std::cout << "Please include a host address, followed by the number of workers";
    }
    kill_flag = false;
    thread_counter = 0;
    numslist = std::vector<short>();
    string host;
    signal(SIGINT, sighandler);
    {
        char buff[512];
        sprintf(buff, "http://%s:%d", argv[1], PORT);
        host = string(buff);
    }
    
    init(host);
    int workers = atoi(argv[2]);
    for (int i = 0; i < workers; i++) {
        thread worker = thread(perform_job, host);
        thread_counter++;
    }

    while (!kill_flag) pause();

    do std::this_thread::sleep_for(50ms); while (thread_counter); //wait for all threads to finish

    return 0;
}