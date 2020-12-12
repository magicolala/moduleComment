<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;

class EmptyController
{
    public function __invoke($data)
    {
        return new Response();
    }
}
