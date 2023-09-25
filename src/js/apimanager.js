import axios from 'axios';

class ApiManager {
  constructor() {
    console.log("[API] Loading...");

    this.apiroot = "https://www.paradisestation.org/forum/custom/changelog_api.php";

    this.all_entries = [];
    this.last_offset = 0;
    this.current_pr = {};
    this.run_count = 0;

    console.log("[API] Loaded.");
  }

  async loadEntriesByDate(date) {
    let target_date = date;

    if (target_date === null) {
      target_date = this.last_offset;
    }

    console.log(`[API] Querying ${target_date}`);
    let response = await axios.get(`${this.apiroot}?d=${target_date}`);

    let last_pr = this.last_pr;

    response.data.forEach(element => {
      if (!(last_pr > 0 && last_pr === element["prn"])) {
        if (this.current_pr === null || this.current_pr.prnum !== element["prn"]) {
          this.current_pr = {};
          this.current_pr["author"] = element["author"];
          this.current_pr["dm"] = element["dm"];
          this.current_pr["pr_number"] = element["prn"];
          this.current_pr["cl_entries"] = [];
          this.last_pr = element["prn"];
          this.all_entries.push(this.current_pr);
        }

        this.current_pr["cl_entries"].push({ "clt": element["clt"], "cle": element["cle"] });

        this.last_offset = element["dm"];
      }
    });
  }

  nextOffset() {
    return this.last_offset;
  }

  getEntries() {
    return this.all_entries;
  }

  clearEntries() {
    this.all_entries.length = 0;
  }
}

export const API = new ApiManager();
window.aa_debug = API;
