using Microsoft.AspNetCore.Mvc;

namespace VETCloud.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
